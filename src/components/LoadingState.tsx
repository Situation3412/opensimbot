import React from 'react';
import { Spinner, Alert } from 'react-bootstrap';

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  children
}) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
        <Spinner animation="border" role="status" className="me-2" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return <>{children}</>;
}; 