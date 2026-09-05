import React, { useState, useRef } from 'react';
import Header from './components/Header.jsx';
import UploadZone from './components/UploadZone.jsx';
import ProcessingView from './components/ProcessingView.jsx';
import ResultView from './components/ResultView.jsx';

function App() {
  const [stage, setStage] = useState('upload'); // 'upload' | 'processing' | 'result'
  const [originalFile, setOriginalFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const progressIntervalRef = useRef(null);

  const handleFileSelect = async (file) => {
    setError(null);
    setOriginalFile(file);
    const objectUrl = URL.createObjectURL(file);
    setOriginalUrl(objectUrl);
    setStage('processing');
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);

    // Progress ticker simulation (10% up to 85%)
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const increment = 8 + Math.floor(Math.random() * 7);
        const nextVal = prev + increment;
        return nextVal > 85 ? 85 : nextVal;
      });
    }, 500);

    try {
      const response = await fetch('http://localhost:8000/remove-background', {
        method: 'POST',
        body: formData,
      });

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      if (!response.ok) {
        let errMessage = 'Failed to remove background from image.';
        try {
          const errData = await response.json();
          if (errData.detail) errMessage = errData.detail;
        } catch {
          // ignore
        }
        throw new Error(errMessage);
      }

      const data = await response.json();

      if (data.success && data.image) {
        setProgress(100);
        setResultUrl(data.image);
        setTimeout(() => {
          setStage('result');
        }, 300);
      } else {
        throw new Error('API returned an invalid response format.');
      }
    } catch (err) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      console.error('Background removal error:', err);
      setError(err.message || 'An unexpected error occurred while processing.');
      setStage('upload');
    }
  };

  const handleReset = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    setStage('upload');
    setOriginalFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-page)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header */}
      <Header />

      {/* Main App Stage Container */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: stage === 'upload' ? 'center' : 'flex-start',
          width: '100%',
          padding: '20px 16px 40px',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {stage === 'upload' && (
          <UploadZone
            onFileSelect={handleFileSelect}
            error={error}
          />
        )}

        {stage === 'processing' && (
          <ProcessingView
            originalUrl={originalUrl}
            progress={progress}
          />
        )}

        {stage === 'result' && (
          <ResultView
            originalUrl={originalUrl}
            initialResultUrl={resultUrl}
            onReset={handleReset}
            onNewImageSelect={handleFileSelect}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          backgroundColor: '#FFFFFF',
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          zIndex: 2,
        }}
      >
        <span>BASAKcut &middot; 100% Free AI Background Removal &middot; High Resolution Downloads</span>
      </footer>
    </div>
  );
}

export default App;
