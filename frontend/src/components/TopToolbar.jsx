import React from 'react';

const TopToolbar = ({
  activeTab = 'background',
  onTabChange,
  isComparing = false,
  onToggleCompare,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onDownload,
  isAntigravityActive = false,
  onToggleAntigravity,
}) => {
  const tabs = [
    { id: 'cutout', label: 'Cutout', icon: '🪄' },
    { id: 'background', label: 'Background', icon: '🖼️' },
    { id: 'effects', label: 'Effects', icon: '🔘' },
    { id: 'adjust', label: 'Adjust', icon: '🎛️' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-pill)',
        padding: '6px 12px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)',
        width: '100%',
        maxWidth: '920px',
        margin: '0 auto 20px',
        flexWrap: 'wrap',
        gap: '8px',
      }}
    >
      {/* Left Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange && onTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: isActive ? '#EDF2F7' : 'transparent',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Controls: Compare, Undo, Redo, Antigravity, Download */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Antigravity Levitation Mode Toggle */}
        <button
          onClick={onToggleAntigravity}
          title="Toggle Antigravity Levitation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '7px 12px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: isAntigravityActive ? 'rgba(123, 80, 255, 0.12)' : 'transparent',
            border: isAntigravityActive ? '1px solid var(--accent-purple)' : '1px solid transparent',
            color: isAntigravityActive ? 'var(--accent-purple)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '12px',
          }}
        >
          <span>✨</span>
          <span>Antigravity</span>
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-color)' }} />

        {/* Compare Button [◫] */}
        <button
          onClick={onToggleCompare}
          title="Compare with Original"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isComparing ? '#EDF2F7' : 'transparent',
            color: isComparing ? 'var(--primary-blue)' : 'var(--text-muted)',
            fontSize: '16px',
            border: isComparing ? '1px solid #CBD5E1' : '1px solid transparent',
          }}
        >
          ◫
        </button>

        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            color: canUndo ? 'var(--text-main)' : 'var(--text-light)',
            fontSize: '15px',
            cursor: canUndo ? 'pointer' : 'not-allowed',
          }}
        >
          ↩
        </button>

        {/* Redo */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            color: canRedo ? 'var(--text-main)' : 'var(--text-light)',
            fontSize: '15px',
            cursor: canRedo ? 'pointer' : 'not-allowed',
          }}
        >
          ↪
        </button>

        {/* Download Button */}
        <button
          onClick={onDownload}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--primary-blue)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 2px 10px var(--primary-blue-glow)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-blue-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-blue)';
          }}
        >
          <span>Download</span>
          <span style={{ fontSize: '12px' }}>▼</span>
        </button>
      </div>
    </div>
  );
};

export default TopToolbar;
