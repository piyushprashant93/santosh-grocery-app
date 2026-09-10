import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 m-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
          <p className="text-sm">There was an error loading this component. Please refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
