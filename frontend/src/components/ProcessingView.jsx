import React from 'react';

const ProcessingView = ({ originalUrl, progress = 0 }) => {
  // Derive current step label based on progress percentage
  const getStepLabel = (pct) => {
    if (pct < 15) return 'Analyzing image';
    if (pct < 40) return 'Running U2Net AI model';
    if (pct < 70) return 'Refining edges';
    if (pct < 90) return 'Compositing output';
    return 'Almost done!';
  };

  const steps = [
    { label: 'Analyze', threshold: 0 },
    { label: 'U2Net AI', threshold: 15 },
    { label: 'Refine', threshold: 40 },
    { label: 'Composite', threshold: 70 },
    { label: 'Finish', threshold: 90 },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        animation: 'fadeUp 0.5s ease',
        zIndex: 1,
        position: 'relative',
      }}
    >
      {/* Thumbnail Container with Pulsing Ring & Scanline */}
      <div
        style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pulsing Outer Ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: 'calc(var(--radius-lg) + 12px)',
            border: '2px solid var(--accent-cyan)',
            animation: 'pulse-ring 1.5s ease-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Second Delayed Pulsing Ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: 'calc(var(--radius-lg) + 12px)',
            border: '2px solid var(--accent-purple)',
            animation: 'pulse-ring 1.5s ease-out infinite 0.75s',
            pointerEvents: 'none',
          }}
        />

        {/* Clipped Thumbnail Box */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            boxShadow: '0 0 25px rgba(0, 229, 255, 0.25)',
          }}
        >
          {originalUrl ? (
            <img
              src={originalUrl}
              alt="Processing Original"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.5,
                filter: 'blur(3px)',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#1c1c2e',
              }}
            />
          )}

          {/* Cyan Scanline Sweeping Continuously */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
              boxShadow: '0 0 16px var(--accent-cyan), 0 0 28px var(--accent-cyan)',
              animation: 'scanline 1.4s linear infinite',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Heading */}
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '28px',
          fontWeight: 700,
          marginBottom: '8px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}
      >
        Removing background…
      </h2>

      {/* Current Step Label */}
      <div
        style={{
          fontSize: '15px',
          color: 'var(--accent-cyan)',
          fontWeight: 500,
          marginBottom: '28px',
          minHeight: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-cyan)',
            boxShadow: '0 0 10px var(--accent-cyan)',
            display: 'inline-block',
          }}
        />
        <span>{getStepLabel(progress)}</span>
      </div>

      {/* Progress Bar Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '8px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          marginBottom: '14px',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            height: '100%',
            borderRadius: '9999px',
            background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))',
            boxShadow: '0 0 14px var(--accent-cyan-glow)',
            transition: 'width 0.4s ease-out',
          }}
        />
      </div>

      {/* Progress Percentage Text */}
      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          marginBottom: '24px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {Math.round(progress)}%
      </div>

      {/* 5 Step Dots Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {steps.map((step, idx) => {
          const isPassed = progress >= step.threshold;
          return (
            <div
              key={idx}
              title={step.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: isPassed ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.15)',
                  boxShadow: isPassed ? '0 0 10px var(--accent-cyan)' : 'none',
                  transition: 'all 0.3s ease',
                  transform: isPassed ? 'scale(1.15)' : 'scale(1)',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  color: isPassed ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: isPassed ? 500 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingView;
