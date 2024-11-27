import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert } from 'react-bootstrap';
import { useConfig } from '../contexts/ConfigContext';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Create a HOC to wrap our ErrorBoundary with the config context
const withConfig = (WrappedComponent: typeof ErrorBoundaryBase) => {
  return function WithConfigWrapper(props: Props) {
    const { config } = useConfig();
    return <WrappedComponent {...props} theme={config.theme} />;
  };
};

// Base ErrorBoundary component that takes theme as a prop
class ErrorBoundaryBase extends Component<Props & { theme: 'light' | 'dark' }, State> {
  public state: State = {
    hasError: false,
    error: null
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
        <Alert variant="danger">
          <Alert.Heading>Something went wrong</Alert.Heading>
          <p>{this.state.error?.message}</p>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Export the wrapped component
export const ErrorBoundary = withConfig(ErrorBoundaryBase); 