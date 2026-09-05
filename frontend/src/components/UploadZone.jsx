import React, { useState, useRef, useEffect } from 'react';

const SAMPLES = [
  { id: 1, label: 'Person', src: '/samples/sample1.jpg' },
  { id: 2, label: 'Animal', src: '/samples/sample2.jpg' },
  { id: 3, label: 'Car', src: '/samples/sample3.jpg' },
  { id: 4, label: 'Plant', src: '/samples/sample4.jpg' },
];

const UploadZone = ({ onFileSelect, error }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setLocalError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLocalError('Please select a valid image file (JPG, PNG, WEBP, BMP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setLocalError('File size exceeds the 15MB limit.');
      return;
    }

    onFileSelect(file);
  };

  // Support paste from clipboard (Ctrl+V anywhere on the page)
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.indexOf('image') !== -1) {
            const blob = item.getAsFile();
            validateAndProcessFile(blob);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Handle clicking one of the sample images
  const handleSampleClick = async (sample) => {
    try {
      const res = await fetch(sample.src);
      const blob = await res.blob();
      const file = new File([blob], `${sample.label.toLowerCase()}.jpg`, { type: 'image/jpeg' });
      validateAndProcessFile(file);
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const displayedError = error || localError;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '30px 16px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1,
        position: 'relative',
        animation: 'fadeUp 0.5s ease',
      }}
    >
      {/* Two Column Hero Layout Matching Screenshot 1 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
          width: '100%',
        }}
      >
        {/* Left Column: Heading + Cutout Feature Showcase */}
        <div
          style={{
            flex: '1 1 450px',
            minWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Showcase visual of cutout person */}
          <div style={{ marginBottom: '24px', position: 'relative', display: 'inline-block' }}>
            <img
              src="/samples/sample1.jpg"
              alt="Cutout Subject Example"
              style={{
                width: '160px',
                height: '160px',
                objectFit: 'cover',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-lg)',
                border: '4px solid #FFFFFF',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                backgroundColor: 'var(--primary-blue)',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                boxShadow: '0 4px 10px rgba(13, 110, 253, 0.4)',
              }}
            >
              ✂
            </div>
          </div>

          <h1
            style={{
              fontSize: 'clamp(38px, 5vw, 62px)',
              lineHeight: 1.1,
              fontWeight: 800,
              color: '#1E293B',
              letterSpacing: '-0.03em',
              marginBottom: '16px',
            }}
          >
            Remove Image <br />
            <span style={{ color: '#0F172A' }}>Background</span>
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: 'clamp(18px, 2.2vw, 24px)',
              fontWeight: 600,
              color: '#334155',
            }}
          >
            <span>100% Automatically and</span>
            <span
              style={{
                backgroundColor: 'var(--primary-blue)',
                color: '#FFFFFF',
                padding: '3px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.9em',
                fontWeight: 700,
              }}
            >
              Free
            </span>
          </div>
        </div>

        {/* Right Column: Upload Card Matching Reference Screenshot 1 */}
        <div
          style={{
            flex: '1 1 440px',
            maxWidth: '480px',
            minWidth: '320px',
          }}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '48px 36px 36px',
              boxShadow: '0 16px 45px rgba(0, 0, 0, 0.07)',
              border: isDragOver
                ? '2.5px dashed var(--primary-blue)'
                : '1px solid rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.25s ease',
              transform: isDragOver ? 'scale(1.01)' : 'scale(1)',
            }}
          >
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  validateAndProcessFile(e.target.files[0]);
                }
              }}
            />

            {/* Prominent Blue Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%',
                maxWidth: '280px',
                padding: '16px 28px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--primary-blue)',
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                boxShadow: '0 8px 24px rgba(13, 110, 253, 0.35)',
                marginBottom: '16px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-blue-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-blue)';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              Upload Image
            </button>

            {/* Drop / Paste Labels */}
            <div
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#475569',
                marginBottom: '4px',
              }}
            >
              or drop a file,
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#94A3B8',
                marginBottom: '32px',
              }}
            >
              paste image or URL (Ctrl + V)
            </div>

            {/* Divider */}
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#F1F5F9',
                marginBottom: '24px',
              }}
            />

            {/* "No image? Try one of these:" Row */}
            <div style={{ width: '100%', textAlign: 'left' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    No image?
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Try one of these:
                  </div>
                </div>

                {/* 4 Sample Image Thumbnails */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {SAMPLES.map((sample) => (
                    <div
                      key={sample.id}
                      onClick={() => handleSampleClick(sample)}
                      title={`Try ${sample.label}`}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1.5px solid #E2E8F0',
                        transition: 'transform 0.15s ease, border-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.08)';
                        e.currentTarget.style.borderColor = 'var(--primary-blue)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                      }}
                    >
                      <img
                        src={sample.src}
                        alt={sample.label}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {displayedError && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '13px',
                  fontWeight: 500,
                  width: '100%',
                }}
              >
                ⚠️ {displayedError}
              </div>
            )}
          </div>

          {/* Legal / Terms Subtext */}
          <div
            style={{
              marginTop: '16px',
              fontSize: '11px',
              color: '#94A3B8',
              textAlign: 'center',
            }}
          >
            By uploading an image or URL you agree to our Terms of Service.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
