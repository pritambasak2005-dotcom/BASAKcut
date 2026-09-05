import React, { useState, useMemo, useEffect } from 'react';

const AntigravityImage = ({ imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Generate 8 floating sparkle particles with random properties
  const sparkles = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const isPurple = i % 2 === 0;
      const size = 3 + Math.floor(Math.random() * 5); // 3-7px
      const dx = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.floor(Math.random() * 31)); // ±30px to ±60px
      const dy = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.floor(Math.random() * 31));
      const duration = (3 + Math.random() * 2).toFixed(2); // 3-5s
      const delay = (Math.random() * 1.5).toFixed(2); // 0-1.5s
      const top = 15 + Math.floor(Math.random() * 70); // 15-85%
      const left = 10 + Math.floor(Math.random() * 80); // 10-90%

      return {
        id: i,
        size,
        color: isPurple ? 'var(--accent-purple)' : 'var(--accent-cyan)',
        glow: isPurple ? 'var(--accent-purple-glow)' : 'var(--accent-cyan-glow)',
        top: `${top}%`,
        left: `${left}%`,
        dx: `${dx}px`,
        dy: `${dy}px`,
        duration: `${duration}s`,
        delay: `${delay}s`,
      };
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '30px 10px 40px',
        position: 'relative',
      }}
    >
      {/* Container with bounceDrop spring entry */}
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: '100%',
          animation: prefersReducedMotion
            ? 'none'
            : 'bounceDrop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        {/* Floating Sparkle Particles */}
        {!prefersReducedMotion &&
          sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              style={{
                position: 'absolute',
                top: sparkle.top,
                left: sparkle.left,
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`,
                borderRadius: '50%',
                backgroundColor: sparkle.color,
                boxShadow: `0 0 10px ${sparkle.glow}, 0 0 16px ${sparkle.glow}`,
                pointerEvents: 'none',
                zIndex: 3,
                '--dx': sparkle.dx,
                '--dy': sparkle.dy,
                animation: `particleDrift ${sparkle.duration} ease-out infinite alternate ${sparkle.delay}`,
              }}
            />
          ))}

        {/* Antigravity Floating Image */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'relative',
            display: 'inline-block',
            animation: prefersReducedMotion
              ? 'none'
              : 'float 3.2s ease-in-out infinite',
            animationPlayState: isHovered ? 'paused' : 'running',
            zIndex: 2,
            transition: 'filter 0.3s ease, transform 0.3s ease',
          }}
        >
          <img
            src={imageUrl}
            alt="Lifted transparent subject"
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: '420px',
              objectFit: 'contain',
              filter: isHovered
                ? 'drop-shadow(0 18px 30px rgba(0, 229, 255, 0.45)) drop-shadow(0 0 12px rgba(123, 80, 255, 0.6))'
                : 'drop-shadow(0 12px 24px rgba(123, 80, 255, 0.35))',
              transition: 'filter 0.3s ease',
              borderRadius: 'var(--radius-md)',
              userSelect: 'none',
            }}
          />
        </div>

        {/* Elliptical Shadow Under Subject */}
        {!prefersReducedMotion && (
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: '14px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(123, 80, 255, 0.45) 0%, transparent 70%)',
              animation: 'floatShadow 3.2s ease-in-out infinite',
              animationPlayState: isHovered ? 'paused' : 'running',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}
      </div>

      {/* Floating Status / Tip */}
      <div
        style={{
          marginTop: '28px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>Hover subject to pause levitation</span>
        <span>·</span>
        <span style={{ color: 'var(--accent-purple)' }}>Defying Gravity FX</span>
      </div>
    </div>
  );
};

export default AntigravityImage;
