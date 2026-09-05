# BASAKcut — AI Background Remover

> **"Remove background. Defy gravity."**
> A fullstack, AI-powered web tool that cuts out subjects instantly with open-source U2Net machine learning, renders a floating antigravity physics visualization, provides an interactive before/after comparison slider, and allows instantaneous background replacement (solid colors, atmospheric gradient presets, or custom image uploads).

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite 5, Vanilla CSS (space theme design system, custom keyframe animations, HTML5 Canvas compositing). Runs on `http://localhost:5173`.
- **Backend**: FastAPI (Python), Uvicorn, Pillow (PIL), `rembg` with pretrained `u2net` model. Runs on `http://localhost:8000`.
- **Machine Learning**: Pretrained `u2net` ONNX model (~170MB, downloaded automatically by `rembg` on first execution).
- **Authentication / Database**: None — completely public and privacy-friendly.

---

## 📋 Prerequisites

- **Python**: 3.9+ (Python 3.10 – 3.13 supported)
- **Node.js**: 18+ (Node 20+ recommended)
- **Git** (optional)

> [!NOTE]
> **First Run Model Download (~170MB)**:
> The first time you process an image, `rembg` will download the pretrained `u2net.onnx` model weights (approx. 170 MB) to your local cache (`~/.u2net/u2net.onnx`). Depending on your network speed, the first image may take 15–45 seconds; subsequent images process in under 1–2 seconds.

---

## ⚡ Quick Start

### Option 1: Automatic Startup Script

- **Linux / macOS / Git Bash**:
  ```bash
  chmod +x start.sh
  ./start.sh
  ```

- **Windows**:
  Double-click `start.bat` or run:
  ```cmd
  start.bat
  ```

---

### Option 2: Manual Setup

#### 1. Backend Setup (Terminal 1)
```bash
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*Backend runs on: `http://localhost:8000` (Docs: `http://localhost:8000/docs`)*

#### 2. Frontend Setup (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

Open `http://localhost:5173` in your browser to start lifting backgrounds!

---

## 📂 Project Structure

```
bgremover/
├── backend/
│   ├── main.py              # FastAPI application (endpoints, CORS, image processing)
│   └── requirements.txt     # Python dependencies (fastapi, rembg, onnxruntime, etc.)
├── frontend/
│   ├── index.html           # Google Fonts (Syne & Inter), meta tags
│   ├── package.json         # React + Vite dependencies
│   ├── vite.config.js       # Vite configuration
│   └── src/
│       ├── main.jsx         # React application entry point
│       ├── App.jsx          # State machine ('upload' -> 'processing' -> 'result')
│       ├── index.css        # Space theme tokens, CSS keyframes, reduced-motion overrides
│       └── components/
│           ├── Header.jsx            # Sticky blurred header with gradient logo & pill badge
│           ├── Particles.jsx         # 60-particle purple/cyan constellation canvas
│           ├── UploadZone.jsx        # Drag-and-drop zone with animated cyan scanline
│           ├── ProcessingView.jsx    # Pulsing preview, step progress indicators, progress bar
│           ├── AntigravityImage.jsx  # Floating subject, synchronized shadow, stardust sparkles
│           ├── BeforeAfterSlider.jsx # Interactive before/after comparison split slider
│           ├── BackgroundPanel.jsx   # Solid colors, presets, custom BG upload, PNG download
│           └── ResultView.jsx        # Responsive two-column result workspace
├── start.sh                 # Unix bash script
├── start.bat                # Windows command batch script
└── README.md                # Documentation and troubleshooting
```

---

## 🔌 API Endpoints

### `GET /health`
Returns health status of the backend.
- **Response**: `{"status": "healthy"}`

### `POST /remove-background`
Accepts a multipart image upload, processes it using `rembg` (U2Net), and returns the transparent PNG cutout as base64.
- **Form Data**: `file` (Image file, max 15MB)
- **Response**:
  ```json
  {
    "success": true,
    "image": "data:image/png;base64,...",
    "width": 1024,
    "height": 768
  }
  ```

### `POST /apply-background`
Composites a transparent foreground PNG over any background image using Pillow `alpha_composite`.
- **Form Data**:
  - `foreground`: Transparent PNG file
  - `background`: Any image file
- **Response**:
  ```json
  {
    "success": true,
    "image": "data:image/png;base64,..."
  }
  ```

---

## 🎨 Frontend Features & Design System

- **Dark Space Theme**: Deep space canvas (`#08080F`), sleek glassmorphic panels (`#0F0F1A`), neon accents in Purple (`#7B50FF`), Cyan (`#00E5FF`), and Pink (`#FF4ECD`).
- **Antigravity Visuals**:
  - Subject levitation loop: `translateY(0px)` -> `translateY(-18px)`
  - Synchronized elliptical ground shadow breathing underneath
  - Dynamic randomized stardust sparkles drifting around the cutout
  - Spring-bounce entry drop on mount
  - Hover pause effect with cyan glow border
- **Before / After Split Slider**: Smooth mouse & touch tracking, transparent checkerboard background, and dual status badges.
- **Background Replacement**:
  - Client-side Canvas compositing for instant solid color fills & 6 space gradient presets (Sunset, Ocean, Galaxy, Forest, Golden Hour, Neon City).
  - Server-side alpha compositing for custom uploaded backgrounds.
- **Accessibility**: Comprehensive `@media (prefers-reduced-motion: reduce)` support.

---

## 🛠️ Common Troubleshooting

### 1. CORS Error in Browser Console
- Ensure backend is running on port 8000 and frontend on port 5173.
- If you run the frontend on a different port or host (e.g., `5174` or your LAN IP), add it to `origins` in `backend/main.py`.

### 2. Port Conflicts
- If port 8000 is occupied: `uvicorn main:app --reload --port 8001` (update API URL in `App.jsx` and `BackgroundPanel.jsx`).
- If port 5173 is occupied: Vite will automatically use `5174`. Update `origins` in `backend/main.py`.

### 3. Model Download Failure / Timeout
- On the very first run, `rembg` downloads `u2net.onnx` (~170MB) from GitHub releases. Ensure you have an active internet connection without strict firewall blocks against GitHub.
- If the download times out, rerun the image processing or download `u2net.onnx` manually into `~/.u2net/u2net.onnx`.

### 4. File Too Large (HTTP 400)
- Files larger than 15MB will be rejected by the backend validation. Compress or downscale the photo before uploading.
