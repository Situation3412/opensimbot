import React, { useState } from 'react';
import { Alert, Button, ProgressBar } from 'react-bootstrap';
import { useSimc } from '../contexts/SimcContext';

export const SimcStatus: React.FC = () => {
  const { isChecking, needsInstall, needsUpdate, currentVersion, error, downloadLatest } = useSimc();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    try {
      setIsInstalling(true);
      await downloadLatest();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  if (isChecking || isInstalling) {
    return (
      <Alert variant="info">
        <div className="d-flex align-items-center justify-content-between">
          <span>{isInstalling ? 'Installing SimulationCraft...' : 'Checking SimulationCraft installation...'}</span>
          <ProgressBar animated now={100} style={{ width: '200px' }} />
        </div>
      </Alert>
    );
  }

  if (error) {
    return <Alert variant="danger">Error checking SimulationCraft: {error}</Alert>;
  }

  if (needsInstall) {
    return (
      <Alert variant="warning">
        <div className="d-flex align-items-center justify-content-between">
          <span>SimulationCraft is not installed.</span>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleInstall}
            disabled={isInstalling}
          >
            Install Now
          </Button>
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
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleInstall}
            disabled={isInstalling}
          >
            Update Now
          </Button>
        </div>
      </Alert>
    );
  }

  return null;
}; 