import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...' }) => (
  <div className="d-flex align-items-center justify-content-center p-4">
    <Spinner animation="border" role="status" className="me-2" />
    <span>{text}</span>
  </div>
); 