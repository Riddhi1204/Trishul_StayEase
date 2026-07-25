import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'var(--font-sans)',
          background: 'var(--bg)',
          color: 'var(--text)'
        }}>
          <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</span>
          <h1 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>Oops! Something went wrong.</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px' }}>
            We're sorry, an unexpected error occurred. This could be due to a temporary glitch or a network issue.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.href = '/'}
            >
              Go to Homepage
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
