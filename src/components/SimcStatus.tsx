import React, { useState, useEffect } from 'react';
import { Alert, Button, ProgressBar, Modal } from 'react-bootstrap';
import { useSimc } from '../contexts/SimcContext';
import { useConfig } from '../contexts/ConfigContext';
import { LINUX_BUILD_INSTRUCTIONS } from '../electron/SimcManager';
import { SimcVersion } from '../electron/types';
import { LinuxBuildModal } from './LinuxBuildModal';

export const SimcStatus: React.FC = () => {
  const { config } = useConfig();
  const { isChecking, needsInstall, needsUpdate, currentVersion, latestVersion, error, downloadLatest, checkInstallation } = useSimc();
  const [isInstalling, setIsInstalling] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);
  const [showError, setShowError] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [buildProgress, setBuildProgress] = useState('');

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  useEffect(() => {
    if (isChecking || isInstalling) {
      setShowProgress(true);
    }
  }, [isChecking, isInstalling]);

  const formatVersion = (version: SimcVersion | null) => {
    if (!version) return 'Not installed';
    if (version.gitVersion) {
      return `git-${version.gitVersion.substring(0, 7)}`;
    }
    return `${version.major}.${version.minor}.${version.patch}`;
  };

  const handleInstall = async () => {
    try {
      const platform = await window.electron.simcManager.getPlatform();
      if (platform === 'linux') {
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

  if ((isChecking || isInstalling) && showProgress) {
    return (
      <Alert 
        variant={config.theme === 'dark' ? 'primary' : 'info'}
        dismissible
        onClose={() => setShowProgress(false)}
      >
        <div className="d-flex align-items-center justify-content-between">
          <span>{isInstalling ? 'Installing SimulationCraft...' : 'Checking SimulationCraft installation...'}</span>
          <ProgressBar animated now={100} style={{ width: '200px' }} />
        </div>
      </Alert>
    );
  }

  if (error && showError) {
    return (
      <Alert 
        variant="danger"
        dismissible
        onClose={() => setShowError(false)}
      >
        Error checking SimulationCraft: {error}
      </Alert>
    );
  }

  if (!needsInstall && !needsUpdate && !showSuccess) {
    return null;
  }

  return (
    <Alert 
      variant={needsInstall || needsUpdate ? 'warning' : 'success'}
      dismissible
      onClose={() => setShowSuccess(false)}
      className="position-relative"
    >
      <div className="d-flex align-items-center justify-content-between">
        <span>
          {!currentVersion 
            ? 'SimulationCraft is not installed' 
            : needsUpdate 
              ? `Update available: ${formatVersion(currentVersion)} → ${formatVersion(latestVersion)}`
              : `SimulationCraft is up to date. Version: ${formatVersion(currentVersion)}`}
        </span>
        {(needsInstall || needsUpdate) && (
          <Button 
            variant={config.theme === 'dark' ? 'outline-light' : 'outline-dark'} 
            onClick={handleInstall}
            disabled={isInstalling}
          >
            {!currentVersion ? 'Install' : 'Update'}
          </Button>
        )}
      </div>

      {showBuildModal && (
        <LinuxBuildModal
          show={showBuildModal}
          onClose={() => setShowBuildModal(false)}
          onComplete={async () => {
            setShowBuildModal(false);
            await checkInstallation();
          }}
          isUpdate={!needsInstall}
        />
      )}
      {buildProgress && <p>{buildProgress}</p>}
    </Alert>
  );
}; 