import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: null,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
      errorId: crypto.randomUUID(),
    };
  }

  componentDidCatch(error, errorInfo) {
    const timestamp = new Date().toISOString();
    const details = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      componentStack: errorInfo?.componentStack,
    };

    console.error(`[${timestamp}] [ErrorBoundary] Unhandled React error`, details);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, errorId } = this.state;

    if (hasError) {
      return (
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "1.5rem",
          }}
        >
          <section
            className="card"
            style={{ maxWidth: "540px", width: "100%", textAlign: "left" }}
            role="alert"
            aria-live="assertive"
          >
            <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Something went wrong</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              The app hit an unexpected error. Please refresh and try again.
            </p>
            <p className="muted" style={{ fontSize: "0.9rem" }}>
              Reference ID: {errorId}
            </p>
            <button type="button" onClick={this.handleReload}>
              Reload app
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
