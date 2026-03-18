import { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children:  ReactNode;
  fallback?: ReactNode;
  /** Optional callback for external error reporting (Sentry, DataDog, etc.) */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error:    Error | null;
}

export class TaskErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Always log — wire to Sentry/DataDog in production
    console.error("[TaskErrorBoundary] Caught render error:", error, info.componentStack);
    this.props.onError?.(error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 my-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-red-500">
              {/* Warning icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5a1 1 0 012 0v3a1 1 0 01-2 0V5zm1 7a1 1 0 110-2 1 1 0 010 2z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                The task list could not be displayed.
              </p>
              {this.state.error && (
                <p className="mt-1 text-xs text-red-600 font-mono">
                  {this.state.error.message}
                </p>
              )}
              <button
                onClick={this.handleReset}
                className="mt-3 text-xs font-medium text-red-700 underline hover:text-red-900 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
