import React, { useState, useRef } from 'react';

// Comprehensive color swatches matching the reference UI
const COLOR_SWATCHES = [
  // Row 2
  { id: 'red', name: 'Red', color: '#EF4444' },
  { id: 'hotpink', name: 'Hot Pink', color: '#EC4899' },
  { id: 'purple', name: 'Purple', color: '#A855F7' },

  // Row 3
  { id: 'deepviolet', name: 'Deep Violet', color: '#6366F1' },
  { id: 'royalblue', name: 'Royal Blue', color: '#3B82F6' },
  { id: 'brightblue', name: 'Bright Blue', color: '#0EA5E9' },

  // Row 4
  { id: 'cyan', name: 'Cyan', color: '#06B6D4' },
  { id: 'turquoise', name: 'Turquoise', color: '#14B8A6' },
  { id: 'emerald', name: 'Emerald', color: '#10B981' },

  // Row 5
  { id: 'green', name: 'Green', color: '#22C55E' },
  { id: 'lightgreen', name: 'Light Green', color: '#84CC16' },
  { id: 'lime', name: 'Lime', color: '#EAB308' },

  // Row 6
  { id: 'amber', name: 'Amber', color: '#F59E0B' },
  { id: 'orange', name: 'Orange', color: '#F97316' },
  { id: 'deeporange', name: 'Deep Orange', color: '#EA580C' },

  // Row 7
  { id: 'brown', name: 'Warm Brown', color: '#78350F' },
  { id: 'slate', name: 'Slate Gray', color: '#475569' },
  { id: 'charcoal', name: 'Charcoal', color: '#1E293B' },

  // Row 8
  { id: 'black', name: 'Black', color: '#000000' },
  { id: 'silver', name: 'Silver Gray', color: '#94A3B8' },
  { id: 'lightgray', name: 'Off White', color: '#F1F5F9' },

  // Row 9 (Pastels)
  { id: 'pastelpink', name: 'Pastel Pink', color: '#FCE7F3' },
  { id: 'pastellavender', name: 'Pastel Lavender', color: '#EDE9FE' },
  { id: 'pastelsky', name: 'Pastel Sky', color: '#E0F2FE' },

  // Row 10 (Soft pastels)
  { id: 'pastelcyan', name: 'Pastel Mint', color: '#CCFBF1' },
  { id: 'pastelgreen', name: 'Pastel Green', color: '#DCFCE7' },
  { id: 'pastelpeach', name: 'Pastel Peach', color: '#FFEDD5' },
];

// Preset Stock Background Scenes for the Photo Tab
const PHOTO_PRESETS = [
  {
    id: 'studio_portrait',
    name: 'Studio Gray',
    src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 'modern_office',
    name: 'Modern Office',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 'nature_green',
    name: 'Garden Greenery',
    src: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 'beach_sunset',
    name: 'Sunset Sky',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 'city_night',
    name: 'City Lights',
    src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 'minimal_wall',
    name: 'Interior Wall',
    src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&auto=format&fit=crop&q=60',
  },
];

const BackgroundPanel = ({
  originalUrl,
  baseResultUrl,
  currentResultUrl,
  onResultUpdate,
}) => {
  const [subTab, setSubTab] = useState('color'); // 'magic' | 'photo' | 'color'
  const [selectedType, setSelectedType] = useState('transparent'); // 'transparent' | 'color' | 'photo' | 'blur'
  const [selectedColor, setSelectedColor] = useState('transparent');
  const [customColor, setCustomColor] = useState('#7B50FF');
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  const [blurLevel, setBlurLevel] = useState(0); // 0, 8, 16, 28
  const [isProcessing, setIsProcessing] = useState(false);

  const colorInputRef = useRef(null);
  const bgUploadInputRef = useRef(null);

  // Helper to load image for canvas compositing
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Convert base64 data URI to Blob
  const base64ToBlob = (base64Uri) => {
    const parts = base64Uri.split(';base64,');
    const contentType = parts[0].replace('data:', '');
    const byteCharacters = atob(parts[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: contentType });
  };

  // Reset to Transparent cutout
  const handleSelectTransparent = () => {
    setSelectedType('transparent');
    setSelectedColor('transparent');
    setSelectedPhotoId(null);
    onResultUpdate(baseResultUrl);
  };

  // Apply Solid Color
  const handleSelectColor = async (color) => {
    setSelectedType('color');
    setSelectedColor(color);
    setSelectedPhotoId(null);

    try {
      const img = await loadImage(baseResultUrl);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const compositedUrl = canvas.toDataURL('image/png');
      onResultUpdate(compositedUrl);
    } catch (err) {
      console.error('Error compositing color:', err);
    }
  };

  // Apply Custom Color from Rainbow Wheel
  const handleCustomColorChange = (hex) => {
    setCustomColor(hex);
    handleSelectColor(hex);
  };

  // Apply Photo Background
  const handleSelectPhoto = async (photo) => {
    setSelectedType('photo');
    setSelectedPhotoId(photo.id);
    setSelectedColor(null);
    setIsProcessing(true);

    try {
      const [fgImg, bgImg] = await Promise.all([
        loadImage(baseResultUrl),
        loadImage(photo.src),
      ]);

      const canvas = document.createElement('canvas');
      canvas.width = fgImg.naturalWidth || fgImg.width;
      canvas.height = fgImg.naturalHeight || fgImg.height;
      const ctx = canvas.getContext('2d');

      // Draw background scaled/covered
      const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
      const scaledW = bgImg.width * scale;
      const scaledH = bgImg.height * scale;
      const offsetX = (canvas.width - scaledW) / 2;
      const offsetY = (canvas.height - scaledH) / 2;

      ctx.drawImage(bgImg, offsetX, offsetY, scaledW, scaledH);
      ctx.drawImage(fgImg, 0, 0);

      onResultUpdate(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('Error applying photo background:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Apply Custom Uploaded Photo Background
  const handleCustomUpload = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setIsProcessing(true);

    try {
      const fgBlob = base64ToBlob(baseResultUrl);
      const formData = new FormData();
      formData.append('foreground', fgBlob, 'foreground.png');
      formData.append('background', file, file.name);

      const res = await fetch('https://basakcut9.onrender.com', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to composite background');
      const data = await res.json();
      if (data.success && data.image) {
        setSelectedType('photo');
        setSelectedPhotoId('custom');
        onResultUpdate(data.image);
      }
    } catch (err) {
      console.error('Error uploading custom background:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Magic Blur Background (using original image blurred behind the cutout)
  const handleApplyBlur = async (blurPx) => {
    setBlurLevel(blurPx);
    setSelectedType('blur');

    if (blurPx === 0) {
      onResultUpdate(baseResultUrl);
      return;
    }

    setIsProcessing(true);
    try {
      const [fgImg, origImg] = await Promise.all([
        loadImage(baseResultUrl),
        loadImage(originalUrl),
      ]);

      const canvas = document.createElement('canvas');
      canvas.width = fgImg.naturalWidth || fgImg.width;
      canvas.height = fgImg.naturalHeight || fgImg.height;
      const ctx = canvas.getContext('2d');

      // Draw blurred original background
      ctx.filter = `blur(${blurPx}px)`;
      ctx.drawImage(origImg, -blurPx, -blurPx, canvas.width + blurPx * 2, canvas.height + blurPx * 2);

      // Draw sharp cutout foreground
      ctx.filter = 'none';
      ctx.drawImage(fgImg, 0, 0);

      onResultUpdate(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('Error applying blur:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '16px',
        width: '100%',
        maxWidth: '360px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sub-Tabs: Magic | Photo | Color */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {[
          { id: 'magic', label: 'Magic' },
          { id: 'photo', label: 'Photo' },
          { id: 'color', label: 'Color' },
        ].map((tab) => {
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: isActive ? '#EDF2F7' : 'transparent',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                textAlign: 'center',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COLOR (Exact 3-Column Grid Matching Reference UI) */}
      {subTab === 'color' && (
        <div
          className="custom-scrollbar"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            maxHeight: '440px',
            overflowY: 'auto',
            paddingRight: '6px',
          }}
        >
          {/* Item 1: Transparent Button with Diagonal Slash ⊘ */}
          <button
            title="Transparent (No Background)"
            onClick={handleSelectTransparent}
            style={{
              aspectRatio: '1',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#FFFFFF',
              backgroundImage:
                'repeating-conic-gradient(#E2E8F0 0% 25%, #FFFFFF 0% 50%)',
              backgroundSize: '12px 12px',
              border:
                selectedType === 'transparent'
                  ? '2.5px solid var(--primary-blue)'
                  : '1.5px solid var(--border-color)',
              boxShadow:
                selectedType === 'transparent'
                  ? '0 0 0 2px rgba(13, 110, 253, 0.25)'
                  : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              color: '#64748B',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 300, lineHeight: 1 }}>⊘</span>
          </button>

          {/* Item 2: Rainbow Spectrum Color Wheel (Custom Picker) */}
          <button
            title="Custom Color (Rainbow Wheel)"
            onClick={() => colorInputRef.current?.click()}
            style={{
              aspectRatio: '1',
              borderRadius: 'var(--radius-sm)',
              background:
                'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
              border:
                selectedType === 'color' && selectedColor === customColor
                  ? '2.5px solid var(--primary-blue)'
                  : '1.5px solid var(--border-color)',
              boxShadow:
                selectedType === 'color' && selectedColor === customColor
                  ? '0 0 0 2px rgba(13, 110, 253, 0.25)'
                  : 'none',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <input
              ref={colorInputRef}
              type="color"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
              }}
            />
          </button>

          {/* Item 3: Pure White Swatch */}
          <button
            title="Pure White"
            onClick={() => handleSelectColor('#FFFFFF')}
            style={{
              aspectRatio: '1',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#FFFFFF',
              border:
                selectedType === 'color' && selectedColor === '#FFFFFF'
                  ? '2.5px solid var(--primary-blue)'
                  : '1.5px solid var(--border-color)',
              boxShadow:
                selectedType === 'color' && selectedColor === '#FFFFFF'
                  ? '0 0 0 2px rgba(13, 110, 253, 0.25)'
                  : 'none',
              cursor: 'pointer',
            }}
          />

          {/* Remaining Rows: 30+ Curated Color Swatches */}
          {COLOR_SWATCHES.map((swatch) => {
            const isSelected =
              selectedType === 'color' && selectedColor === swatch.color;
            return (
              <button
                key={swatch.id}
                title={swatch.name}
                onClick={() => handleSelectColor(swatch.color)}
                style={{
                  aspectRatio: '1',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: swatch.color,
                  border: isSelected
                    ? '2.5px solid var(--primary-blue)'
                    : '1.5px solid rgba(0,0,0,0.06)',
                  boxShadow: isSelected
                    ? '0 0 0 2px rgba(13, 110, 253, 0.35)'
                    : 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            );
          })}
        </div>
      )}

      {/* TAB 2: PHOTO BACKGROUNDS */}
      {subTab === 'photo' && (
        <div
          className="custom-scrollbar"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '440px',
            overflowY: 'auto',
            paddingRight: '6px',
          }}
        >
          {/* Upload Custom BG Box */}
          <div
            onClick={() => bgUploadInputRef.current?.click()}
            style={{
              border: '2px dashed #CBD5E1',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#F8FAFC',
            }}
          >
            <input
              ref={bgUploadInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleCustomUpload}
            />
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>➕</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
              Upload Background
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              JPG or PNG image
            </div>
          </div>

          {/* Preset Photo Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {PHOTO_PRESETS.map((photo) => {
              const isSelected = selectedPhotoId === photo.id;
              return (
                <div
                  key={photo.id}
                  onClick={() => handleSelectPhoto(photo)}
                  style={{
                    height: '80px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    border: isSelected
                      ? '2.5px solid var(--primary-blue)'
                      : '1px solid var(--border-color)',
                    boxShadow: isSelected
                      ? '0 0 0 2px rgba(13, 110, 253, 0.3)'
                      : 'none',
                  }}
                >
                  <img
                    src={photo.thumb}
                    alt={photo.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '4px 6px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      fontSize: '11px',
                      color: '#FFFFFF',
                      fontWeight: 500,
                    }}
                  >
                    {photo.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MAGIC / BLUR */}
      {subTab === 'magic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Keep the original background scene and softly blur it to create depth of field:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: 'No Blur', blur: 0, icon: '🫧' },
              { label: 'Soft Blur', blur: 8, icon: '🌫️' },
              { label: 'Medium Blur', blur: 16, icon: '🌫️' },
              { label: 'Deep Blur', blur: 28, icon: '☁️' },
            ].map((option) => {
              const isActive = selectedType === 'blur' && blurLevel === option.blur;
              return (
                <button
                  key={option.label}
                  onClick={() => handleApplyBlur(option.blur)}
                  style={{
                    padding: '14px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? '#EDF2F7' : '#F8FAFC',
                    border: isActive
                      ? '2px solid var(--primary-blue)'
                      : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{option.icon}</span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--primary-blue)' : 'var(--text-main)',
                    }}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Processing Spinner Overlay if loading */}
      {isProcessing && (
        <div
          style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--primary-blue)',
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              border: '2px solid #CBD5E1',
              borderTopColor: 'var(--primary-blue)',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span>Applying background...</span>
        </div>
      )}
    </div>
  );
};

export default BackgroundPanel;
