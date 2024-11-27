import React, { useState } from 'react';
import { Alert, Button, ProgressBar, Modal } from 'react-bootstrap';
import { useSimc } from '../contexts/SimcContext';
import { useConfig } from '../contexts/ConfigContext';
import { LINUX_BUILD_INSTRUCTIONS } from '../electron/SimcManager';

export const SimcStatus: React.FC = () => {
  const { config } = useConfig();
  const { isChecking, needsInstall, needsUpdate, currentVersion, error, downloadLatest } = useSimc();
  const [isInstalling, setIsInstalling] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [buildProgress, setBuildProgress] = useState<string>('');

  const handleInstall = async () => {
    try {
      if (process.platform === 'linux') {
        setShowBuildModal(true);
        return;
      }

      setIsInstalling(true);
      await downloadLatest();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleBuild = async () => {
    try {
      setShowBuildModal(false);
      setIsInstalling(true);
      setBuildProgress('Installing dependencies...');
      
      await downloadLatest();
      
      setBuildProgress('');
      setIsInstalling(false);
    } catch (error) {
      console.error('Build failed:', error);
      setIsInstalling(false);
      setBuildProgress('');
    }
  };

  if (isChecking || isInstalling) {
    return (
      <Alert variant={config.theme === 'dark' ? 'primary' : 'info'}>
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
      <Alert variant={config.theme === 'dark' ? 'warning' : 'warning'}>
        <div className="d-flex align-items-center justify-content-between">
          <span>SimulationCraft is not installed.</span>
          <Button 
            variant={config.theme === 'dark' ? 'outline-light' : 'outline-dark'}
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

  return (
    <>
      <Modal show={showBuildModal} onHide={() => setShowBuildModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Build SimulationCraft</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre className="bg-dark text-light p-3 rounded">
            {LINUX_BUILD_INSTRUCTIONS}
          </pre>
          <p className="text-muted">
            Note: This will require sudo access and may take several minutes.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBuildModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBuild}>
            Build Now
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}; 