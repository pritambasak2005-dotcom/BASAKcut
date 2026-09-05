import React, { useState, useRef, useEffect, useCallback } from 'react';

const BeforeAfterSlider = ({ originalUrl, resultUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    // Clamp between 2% and 98%
    const clamped = Math.min(98, Math.max(2, percentage));
    setSliderPosition(clamped);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    handleMove(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Fallback mouse/touch document listeners for compatibility
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e) => handleMove(e.clientX);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };
    const onMouseUp = () => setIsDragging(false);
    const onTouchEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleMove]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {/* Slider Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          maxHeight: '440px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
          cursor: isDragging ? 'ew-resize' : 'col-resize',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        {/* Layer 1: Removed BG (Right side shown by default behind clip) on Checkerboard Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-conic-gradient(#1f1f2e 0% 25%, #151522 0% 50%)',
            backgroundPosition: '50% 50%',
            backgroundSize: '20px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={resultUrl}
            alt="Removed Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Layer 2: Original Image on Left side, clipped to slider position */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0c0c16',
          }}
        >
          <img
            src={originalUrl}
            alt="Original"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Draggable Vertical Divider */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: '2px',
            background: 'linear-gradient(180deg, var(--accent-purple), var(--accent-cyan))',
            boxShadow: '0 0 10px var(--accent-cyan), 0 0 20px var(--accent-purple-glow)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* Circular Handle in Center */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
              boxShadow: '0 0 16px var(--accent-cyan-glow), 0 4px 10px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '-1px',
              pointerEvents: 'none',
              border: '2px solid rgba(255, 255, 255, 0.8)',
            }}
          >
            ◀▶
          </div>
        </div>

        {/* Labels */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            padding: '5px 12px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#08080F',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          Original
        </div>

        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            padding: '5px 12px',
            borderRadius: '9999px',
            backgroundColor: 'var(--accent-purple)',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            boxShadow: '0 2px 10px var(--accent-purple-glow)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          Removed BG
        </div>
      </div>

      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        Drag slider left or right to compare
      </span>
    </div>
  );
};

export default BeforeAfterSlider;
