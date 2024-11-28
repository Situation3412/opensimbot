import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Alert, ProgressBar, Form } from 'react-bootstrap';
import { useConfig } from '../contexts/ConfigContext';

interface Step {
  title: string;
  description: string;
  command?: string | ((pmName: string) => string);
  needsSudo?: boolean;
  sudoReason?: string;
  optional?: boolean;
}

const BUILD_STEPS: Step[] = [
  {
    title: 'Check Package Manager',
    description: 'Detect your Linux distribution\'s package manager to install required dependencies.',
    command: 'Checking for apt-get, dnf, yum, pacman, or zypper'
  },
  {
    title: 'Install Dependencies',
    description: 
      'We need to install a few tools to build SimulationCraft from source:<br/><br/>' +
      '• git - Downloads the latest SimulationCraft code from its developers<br/>' +
      '• make - Helps organize and run the build process<br/>' +
      '• cmake - Prepares the code for building on your system<br/>' +
      '• g++ - The actual compiler that turns the code into a program<br/>' +
      '• libcurl - Allows SimulationCraft to download character data from Blizzard<br/><br/>' +
      'This step requires administrator privileges because we\'re installing system-wide tools.',
    command: (pmName) => {
      const pkgName = pmName === 'APT' ? 'libcurl4-openssl-dev' : 'libcurl-devel';
      const installCmd = {
        'APT': 'sudo apt-get install -y',
        'DNF': 'sudo dnf install -y',
        'YUM': 'sudo yum install -y',
        'PACMAN': 'sudo pacman -S --noconfirm',
        'ZYPPER': 'sudo zypper install -y'
      }[pmName] || 'sudo apt-get install -y';
      
      return `${installCmd} git make cmake g++ ${pkgName}`;
    },
    needsSudo: true,
    sudoReason: 'Installing system packages requires administrator privileges.'
  },
  {
    title: 'Clone/Update Repository',
    description: 'SimulationCraft will be cloned or updated from the official GitHub repository to ~/.config/opensimbot/simc-build/simc',
    command: 'Git clone/pull'
  },
  {
    title: 'Build SimulationCraft',
    description: 'The application will be compiled from source using make. This may take a few minutes.',
    command: 'make -C engine OPENSSL=1 optimized'
  },
  {
    title: 'Setup Complete!',
    description: 'SimulationCraft has been successfully installed and is ready to use with Open SimBot. ' +
                'You can now close this window and start using the application. Happy simming!',
  }
];

interface Props {
  show: boolean;
  onClose: () => void;
  onComplete: () => void;
  isUpdate?: boolean;
}

interface SudoPromptProps {
  show: boolean;
  onSubmit: (password: string) => void;
  onCancel: () => void;
  error?: string;
}

const SudoPrompt: React.FC<SudoPromptProps> = ({ show, onSubmit, onCancel, error }) => {
  const [password, setPassword] = useState('');
  const { config } = useConfig();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
    setPassword(''); // Clear password after use
  };

  return (
    <Modal show={show} onHide={onCancel} backdrop="static">
      <Modal.Header className={config.theme === 'dark' ? 'bg-dark text-light' : ''}>
        <Modal.Title>Administrator Password Required</Modal.Title>
      </Modal.Header>
      <Modal.Body className={config.theme === 'dark' ? 'bg-dark text-light' : ''}>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Please enter your sudo password:</Form.Label>
            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              isInvalid={!!error}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className={config.theme === 'dark' ? 'bg-dark text-light' : ''}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

interface IpcError {
  message?: string;
  code?: string;
}

export const LinuxBuildModal: React.FC<Props> = ({ show, onClose, onComplete, isUpdate = false }) => {
  const { config } = useConfig();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepOutput, setStepOutput] = useState<string>('');
  const [stepStatus, setStepStatus] = useState<'pending' | 'running' | 'complete' | 'error'>('pending');
  const [detectedPM, setDetectedPM] = useState<string>('');
  const [buildOutput, setBuildOutput] = useState<string[]>([]);
  const [showSudoPrompt, setShowSudoPrompt] = useState(false);
  const [validatedSudoPassword, setValidatedSudoPassword] = useState<string | undefined>(undefined);
  const [sudoError, setSudoError] = useState<string | undefined>(undefined);
  const [liveOutput, setLiveOutput] = useState<string>('');
  const outputRef = useRef<HTMLPreElement>(null);
  const [missingDependencies, setMissingDependencies] = useState<string[]>([]);
  const [hasCheckedDependencies, setHasCheckedDependencies] = useState(false);
  const [skipOptionalStep, setSkipOptionalStep] = useState(false);

  useEffect(() => {
    const handleProgress = (output: string) => {
      setLiveOutput(prev => prev + output);
    };

    window.electron.simc.onProgress(handleProgress);

    return () => {
      window.electron.simc.offProgress();
    };
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [liveOutput]);

  useEffect(() => {
    if (validatedSudoPassword && missingDependencies.length > 0) {
      console.log('Password changed, retrying step');  // Debug log
      handleStepExecution();
    }
  }, [validatedSudoPassword]);  // Only trigger on password changes

  const handleStepExecution = async () => {
    if (currentStep === BUILD_STEPS.length - 1) {
      return;
    }

    setStepStatus('running');
    
    try {
      if (currentStep === 1) {
        console.log('Step 1: Dependencies', {  // Debug log
          hasCheckedDependencies,
          missingDependencies,
          validatedSudoPassword
        });

        // First time through, check dependencies
        if (!hasCheckedDependencies) {
          const missing = await window.electron.simcManager.checkMissingDependencies();
          console.log('Found missing dependencies:', missing);  // Debug log
          setMissingDependencies(missing);
          setHasCheckedDependencies(true);
          
          if (missing.length === 0) {
            setStepStatus('complete');
            return;
          }
          
          // If we found missing packages, prompt for sudo
          setShowSudoPrompt(true);
          return;
        }

        // If we have missing dependencies and a password, try to install
        if (missingDependencies.length > 0 && validatedSudoPassword) {
          console.log('Installing dependencies:', {  // Debug log
            packages: missingDependencies,
            hasSudoPassword: !!validatedSudoPassword
          });

          try {
            const result = await window.electron.simcManager.installDependencies({
              packages: missingDependencies,
              sudoPassword: validatedSudoPassword
            });
            console.log('Install result:', result);  // Debug log
            setStepStatus('complete');
            setValidatedSudoPassword(undefined);
            setMissingDependencies([]);
            return;
          } catch (error) {
            console.error('Install error:', error);  // Debug log
            if (error instanceof Error && error.message.includes('SUDO_AUTH_FAILED')) {
              setSudoError('Incorrect password. Please try again.');
              setValidatedSudoPassword(undefined);
              setShowSudoPrompt(true);
              return;
            }
            throw error;
          }
        }

        // If we have no missing dependencies, we're done
        if (missingDependencies.length === 0) {
          setStepStatus('complete');
          return;
        }

        return;
      } else {
        // For all other steps (except final)
        const output = await window.electron.simcManager.executeLinuxBuildStep({
          step: currentStep,
          isUpdate,
          sudoPassword: validatedSudoPassword
        });
        
        if (currentStep === 0) {
          const match = output.match(/Detected package manager: (\w+)/);
          if (match) {
            setDetectedPM(match[1]);
          }
        }
        
        setStepStatus('complete');
        if (validatedSudoPassword) {
          setValidatedSudoPassword(undefined);
        }
      }
    } catch (error) {
      console.log('Caught error:', error);
      
      setStepStatus('error');
      setStepOutput(typeof error === 'string' ? error : String(error));
      if (validatedSudoPassword) {
        setValidatedSudoPassword(undefined);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < BUILD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setLiveOutput('');
      setStepStatus('pending');
      setValidatedSudoPassword(undefined);
      setHasCheckedDependencies(false);
    } else {
      onComplete();
    }
  };

  const getCurrentCommand = () => {
    const command = BUILD_STEPS[currentStep].command;
    if (typeof command === 'function') {
      return command(detectedPM);
    }
    return command;
  };

  const handleSudoSubmit = (password: string) => {
    console.log('Got sudo password, updating state');  // Debug log
    setShowSudoPrompt(false);
    setSudoError(undefined);
    setValidatedSudoPassword(password);
    
    // Call handleStepExecution directly after setting the password
    setTimeout(() => {
      console.log('State updated, retrying step');  // Debug log
      handleStepExecution();
    }, 0);
  };

  const handleClose = () => {
    setValidatedSudoPassword(undefined);
    onClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header className={config.theme === 'dark' ? 'bg-dark text-light' : ''}>
          <Modal.Title>{isUpdate ? 'Update' : 'Install'} SimulationCraft</Modal.Title>
        </Modal.Header>
        <Modal.Body className={config.theme === 'dark' ? 'bg-dark text-light' : ''}>
          <div className="mb-4">
            <h5>Step {currentStep + 1} of {BUILD_STEPS.length}: {BUILD_STEPS[currentStep].title}</h5>
            <p dangerouslySetInnerHTML={{ __html: BUILD_STEPS[currentStep].description }}></p>
            
            {getCurrentCommand() && currentStep !== BUILD_STEPS.length - 1 && (
              <div className="bg-dark text-light p-2 rounded">
                <code>{getCurrentCommand()}</code>
              </div>
            )}

            {liveOutput && (
              <pre 
                ref={outputRef}
                className="mt-3 p-2 bg-dark text-light rounded" 
                style={{ 
                  maxHeight: '200px', 
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}
              >
                {liveOutput}
              </pre>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className={config.theme === 'dark' ? 'bg-dark text-light' : ''}>
          {currentStep !== BUILD_STEPS.length - 1 && (
            <Button variant="secondary" onClick={handleClose} disabled={stepStatus === 'running'}>
              Cancel
            </Button>
          )}
          {currentStep === BUILD_STEPS.length - 1 ? (
            <Button variant="success" onClick={onComplete}>
              Finish
            </Button>
          ) : (
            <>
              {stepStatus === 'pending' && (
                <Button variant="primary" onClick={handleStepExecution}>
                  Execute Step
                </Button>
              )}
              {(stepStatus === 'complete' || stepStatus === 'error') && (
                <Button 
                  variant={stepStatus === 'complete' ? 'success' : 'danger'} 
                  onClick={handleNext}
                >
                  Next Step
                </Button>
              )}
            </>
          )}
        </Modal.Footer>
      </Modal>
      <SudoPrompt
        show={showSudoPrompt}
        onSubmit={handleSudoSubmit}
        onCancel={() => {
          setShowSudoPrompt(false);
          setStepStatus('pending');
        }}
        error={sudoError}
      />
    </>
  );
}; 