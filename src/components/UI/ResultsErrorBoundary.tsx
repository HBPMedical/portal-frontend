import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: JSX.Element;
}

interface State {
  error: Error;
}

class ResultsErrorBoundary extends Component<Props> {
  state = {
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info);
  }

  render(): JSX.Element {
    if (this.state.error) {
      return (
        <div className="error">
          <h3>An error has occured</h3>
          <p>test</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ResultsErrorBoundary;
