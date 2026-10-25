import React from 'react';

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fdf2f4', color: '#881235', fontFamily: 'sans-serif' }}>
          <h2>Etwas ist schiefgelaufen. (React Error)</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '10px', marginTop: '10px' }}>{this.state.error?.stack}</pre>
          <button onClick={() => { this.setState({hasError: false}); window.localStorage.clear(); window.location.reload(); }} style={{ marginTop: '20px', padding: '10px', background: '#881235', color: 'white', border: 'none', borderRadius: '4px' }}>
            App neu laden (Local Storage leeren)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
