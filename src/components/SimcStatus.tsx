import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useSimcCheck } from '../hooks/useSimcCheck';

export const SimcStatus: React.FC = () => {
  const { isChecking, needsInstall, needsUpdate, currentVersion, error } = useSimcCheck();

  if (isChecking) {
    return <Alert variant="info">Checking SimulationCraft installation...</Alert>;
  }

  if (error) {
    return <Alert variant="danger">Error checking SimulationCraft: {error}</Alert>;
  }

  if (needsInstall) {
    return (
      <Alert variant="warning">
        <div className="d-flex align-items-center justify-content-between">
          <span>SimulationCraft is not installed.</span>
          <Button variant="primary" size="sm">Install Now</Button>
        </div>
      </Alert>
    );
  }

  if (needsUpdate) {
    return (
      <Alert variant="info">
        <div className="d-flex align-items-center justify-content-between">
          <span>
            A new version of SimulationCraft is available. Current version: {
              currentVersion ? `${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}` : 'unknown'
            }
          </span>
          <Button variant="primary" size="sm">Update Now</Button>
        </div>
      </Alert>
    );
  }

  return null;
}; 