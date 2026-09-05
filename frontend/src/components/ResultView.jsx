import React, { useState, useRef } from 'react';
import TopToolbar from './TopToolbar.jsx';
import BeforeAfterSlider from './BeforeAfterSlider.jsx';
import AntigravityImage from './AntigravityImage.jsx';
import BackgroundPanel from './BackgroundPanel.jsx';

const ResultView = ({ originalUrl, initialResultUrl, onReset, onNewImageSelect }) => {
  // History stack for Undo / Redo
  const [history, setHistory] = useState([initialResultUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active toolbar view / mode
  const [activeTab, setActiveTab] = useState('background');
  const [isComparing, setIsComparing] = useState(false);
  const [isAntigravityActive, setIsAntigravityActive] = useState(false);

  const fileInputRef = useRef(null);

  const currentResultUrl = history[historyIndex] || initialResultUrl;

  const handleResultUpdate = (newUrl) => {
    if (newUrl === currentResultUrl) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = currentResultUrl;
    a.download = 'basakcut-result.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '16px 16px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Top Floating Toolbar matching reference UI */}
      <TopToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isComparing={isComparing}
        onToggleCompare={() => setIsComparing((prev) => !prev)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDownload={handleDownload}
        isAntigravityActive={isAntigravityActive}
        onToggleAntigravity={() => setIsAntigravityActive((prev) => !prev)}
      />

      {/* Main Workspace Layout */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          width: '100%',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {/* Left / Center Canvas Area */}
        <div
          style={{
            flex: '1 1 540px',
            minWidth: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Main Visual Display Box */}
          <div
            style={{
              width: '100%',
              minHeight: '440px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              backgroundImage:
                'repeating-conic-gradient(#F1F5F9 0% 25%, #FFFFFF 0% 50%)',
              backgroundSize: '20px 20px',
            }}
          >
            {isComparing ? (
              <BeforeAfterSlider
                originalUrl={originalUrl}
                resultUrl={currentResultUrl}
              />
            ) : isAntigravityActive ? (
              <AntigravityImage imageUrl={currentResultUrl} />
            ) : (
              <img
                src={currentResultUrl}
                alt="Cutout Subject Result"
                style={{
                  maxWidth: '100%',
                  maxHeight: '420px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                }}
              />
            )}
          </div>

          {/* Bottom Dock Strip matching reference Screenshots 2 & 3 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            {/* [+] Upload Another Image Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  if (onNewImageSelect) {
                    onNewImageSelect(e.target.files[0]);
                  } else {
                    onReset();
                  }
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload another image"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#EDF2F7',
                border: '1px solid var(--border-color)',
                color: '#475569',
                fontSize: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E2E8F0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EDF2F7')}
            >
              +
            </button>

            {/* Current Active Thumbnail with Blue Outline Ring */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2.5px solid var(--primary-blue)',
                boxShadow: '0 0 0 2px rgba(13, 110, 253, 0.25)',
                position: 'relative',
              }}
            >
              <img
                src={initialResultUrl}
                alt="Current session thumbnail"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  backgroundColor: 'var(--primary-blue)',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '8px',
                }}
              >
                ^
              </div>
            </div>

            {/* Back to Home / Reset */}
            <button
              onClick={onReset}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Right Side Background Selector Panel */}
        <div
          style={{
            flex: '0 0 350px',
            width: '100%',
            maxWidth: '360px',
          }}
        >
          <BackgroundPanel
            originalUrl={originalUrl}
            baseResultUrl={initialResultUrl}
            currentResultUrl={currentResultUrl}
            onResultUpdate={handleResultUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultView;
