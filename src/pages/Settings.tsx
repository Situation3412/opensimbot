import React from 'react';
import { Container, Form } from 'react-bootstrap';
import { useSimc } from '../contexts/SimcContext';
import { useConfig } from '../contexts/ConfigContext';
import { ThemedFormControl, ThemedSelect } from '../components/ThemedFormControl';
import { ThemedCard } from '../components/ThemedCard';

export const Settings: React.FC = () => {
  const { currentVersion } = useSimc();
  const { config, updateConfig } = useConfig();

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateConfig({ theme });
    document.body.className = theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark';
  };

  const getVersionDisplay = () => {
    console.log('Current version in Settings:', currentVersion);
    
    if (!currentVersion) return 'Not installed';
    
    // For Linux, show git version
    if (currentVersion.gitVersion) {
      console.log('Using git version:', currentVersion.gitVersion);
      return `git-${currentVersion.gitVersion}`;
    }
    
    // For Windows/Mac, show version numbers
    console.log('Using version numbers:', currentVersion);
    return `${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}`;
  };

  return (
    <Container className="py-4">
      <ThemedCard>
        <ThemedCard.Header>SimulationCraft Settings</ThemedCard.Header>
        <ThemedCard.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Theme</Form.Label>
              <ThemedSelect
                value={config.theme}
                onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </ThemedSelect>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Installed Version</Form.Label>
              <ThemedFormControl
                type="text"
                value={getVersionDisplay()}
                readOnly
                plaintext
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Iterations</Form.Label>
              <ThemedFormControl
                type="number"
                value={config.iterations}
                onChange={(e) => updateConfig({ iterations: parseInt(e.target.value) })}
                min={100}
                max={100000}
              />
              <Form.Text className={config.theme === 'dark' ? 'text-light' : 'text-muted'}>
                Higher values provide more accurate results but take longer to simulate
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Threads</Form.Label>
              <ThemedFormControl
                type="number"
                value={config.threads}
                onChange={(e) => updateConfig({ threads: parseInt(e.target.value) })}
                min={1}
                max={navigator.hardwareConcurrency || 8}
              />
              <Form.Text className={config.theme === 'dark' ? 'text-light' : 'text-muted'}>
                Maximum recommended threads: {navigator.hardwareConcurrency || 8}
              </Form.Text>
            </Form.Group>
          </Form>
        </ThemedCard.Body>
      </ThemedCard>
    </Container>
  );
}; 