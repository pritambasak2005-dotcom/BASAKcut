import io
import base64
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from rembg import new_session, remove

app = FastAPI(title="BASAKcut API", description="AI Background Remover API using rembg and U2Net")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 15MB limit in bytes
MAX_FILE_SIZE = 15 * 1024 * 1024

# Pre-initialize or lazy load the U2Net session
session = None

def get_session():
    global session
    if session is None:
        session = new_session("u2net")
    return session


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/remove-background")
async def remove_background(file: UploadFile = File(...)):
    try:
        # Validate content type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, 
                detail="Invalid file format. Please upload an image (JPG, PNG, WEBP, etc.)."
            )

        # Read file contents
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400, 
                detail=f"File size exceeds the 15MB limit ({len(contents)/(1024*1024):.2f}MB provided)."
            )

        # Process image with rembg U2Net model
        rembg_session = get_session()
        output_bytes = remove(contents, session=rembg_session)

        # Extract dimensions using Pillow
        with Image.open(io.BytesIO(output_bytes)) as pil_img:
            width, height = pil_img.size

        # Convert output to base64 data URI
        base64_img = base64.b64encode(output_bytes).decode("utf-8")
        data_uri = f"data:image/png;base64,{base64_img}"

        return {
            "success": True,
            "image": data_uri,
            "width": width,
            "height": height
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process image: {str(e)}"
        )


@app.post("/apply-background")
async def apply_background(
    foreground: UploadFile = File(...),
    background: UploadFile = File(...)
):
    try:
        # Validate mime types
        if not foreground.content_type or not foreground.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Foreground file must be an image.")
        if not background.content_type or not background.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Background file must be an image.")

        fg_bytes = await foreground.read()
        bg_bytes = await background.read()

        if len(fg_bytes) > MAX_FILE_SIZE or len(bg_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="One or more files exceed the 15MB limit.")

        # Open foreground and background with PIL
        with Image.open(io.BytesIO(fg_bytes)) as fg_raw, Image.open(io.BytesIO(bg_bytes)) as bg_raw:
            fg_img = fg_raw.convert("RGBA")
            bg_img = bg_raw.convert("RGBA")

            # Resize background to match foreground dimensions
            bg_resized = bg_img.resize((fg_img.width, fg_img.height), Image.Resampling.LANCZOS)

            # Composite foreground onto background
            composite = Image.alpha_composite(bg_resized, fg_img)

            # Export as PNG
            output_buffer = io.BytesIO()
            composite.save(output_buffer, format="PNG")
            composite_bytes = output_buffer.getvalue()

            base64_img = base64.b64encode(composite_bytes).decode("utf-8")
            data_uri = f"data:image/png;base64,{base64_img}"

            return {
                "success": True,
                "image": data_uri
            }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to composite background: {str(e)}"
        )
