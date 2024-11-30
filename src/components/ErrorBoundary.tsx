import React, { Component } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

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
      const isDark = this.props.theme === 'dark';

      return (
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card>
            <Card.Body>
              <div className="text-center">
                <div className={`text-6xl mb-4 ${
                  isDark ? 'text-red-400' : 'text-red-500'
                }`}>
                  ⚠️
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Something went wrong
                </h2>
                <p className={`mb-8 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="primary"
                >
                  Reload Page
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = withConfig(ErrorBoundaryBase); 