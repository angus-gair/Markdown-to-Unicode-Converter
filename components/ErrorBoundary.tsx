
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Fix: Extending from 'Component' directly from React often resolves property inference issues in certain TS environments
class ErrorBoundary extends Component<Props, State> {
  // Initialize state directly as a class property
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h1 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-4">The application encountered an error and could not load.</p>
            <pre className="bg-gray-900 p-3 rounded text-xs text-red-300 overflow-auto mb-4 border border-gray-700">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    // Standard access to this.props, enabled by extending Component<Props, State>
    return this.props.children;
  }
}

export default ErrorBoundary;
