import React, { useState } from 'react';
import { Alert, Button, ProgressBar, Modal } from 'react-bootstrap';
import { useSimc } from '../contexts/SimcContext';
import { useConfig } from '../contexts/ConfigContext';
import { LINUX_BUILD_INSTRUCTIONS } from '../electron/SimcManager';
import { SimcVersion } from '../electron/types';

export const SimcStatus: React.FC = () => {
  const { config } = useConfig();
  const { isChecking, needsInstall, needsUpdate, currentVersion, latestVersion, error, downloadLatest } = useSimc();
  const [isInstalling, setIsInstalling] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [buildProgress, setBuildProgress] = useState<string>('');

  const formatVersion = (version: SimcVersion | null) => {
    if (!version) return 'Not installed';
    if (version.gitVersion) {
      return `git-${version.gitVersion.substring(0, 7)}`;
    }
    return `${version.major}.${version.minor}.${version.patch}`;
  };

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

  return (
    <Alert variant={needsInstall || needsUpdate ? 'warning' : 'success'}>
      <div className="d-flex align-items-center justify-content-between">
        <span>
          {needsInstall 
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
            {needsInstall ? 'Install' : 'Update'}
          </Button>
        )}
      </div>
    </Alert>
  );
}; 