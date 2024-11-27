import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { useConfig } from '../contexts/ConfigContext';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface WithThemeProps {
  theme: 'dark' | 'light';
}

// Helper function to resolve system theme
const resolveTheme = (theme: 'dark' | 'light' | 'system'): 'dark' | 'light' => {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
};

export const withConfig = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithThemeProps>
) => {
  return function WithConfigWrapper(props: P) {
    const { config } = useConfig();
    return <WrappedComponent {...props} theme={resolveTheme(config.theme)} />;
  };
};

class ErrorBoundaryBase extends Component<Props & WithThemeProps, State> {
  constructor(props: Props & WithThemeProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant={this.props.theme === 'dark' ? 'danger' : 'danger'}>
          <Alert.Heading>Something went wrong</Alert.Heading>
          <p>{this.state.error?.message}</p>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = withConfig(ErrorBoundaryBase); 