import React from 'react';
import { Container, Form } from 'react-bootstrap';
import { useSimc } from '../contexts/SimcContext';
import { useConfig } from '../contexts/ConfigContext';
import { ThemedFormControl, ThemedSelect } from '../components/ThemedFormControl';
import { ThemedCard } from '../components/ThemedCard';
import { SimcVersion } from '../electron/types';

export const Settings: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const { currentVersion } = useSimc();

  const formatVersion = (version: SimcVersion | null) => {
    if (!version) return 'Not installed';
    if (version.gitVersion) {
      return `git-${version.gitVersion.substring(0, 7)}`;
    }
    return `${version.major}.${version.minor}.${version.patch}`;
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateConfig({ theme: e.target.value as 'light' | 'dark' | 'system' });
  };

  const handleIterationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ iterations: parseInt(e.target.value) });
  };

  const handleThreadsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ threads: parseInt(e.target.value) });
  };

  return (
    <Container className="py-4">
      <ThemedCard>
        <ThemedCard.Header>Settings</ThemedCard.Header>
        <ThemedCard.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Theme</Form.Label>
              <ThemedSelect
                value={config.theme}
                onChange={handleThemeChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </ThemedSelect>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Installed Version</Form.Label>
              <ThemedFormControl
                type="text"
                value={formatVersion(currentVersion)}
                readOnly
                plaintext
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Iterations</Form.Label>
              <ThemedFormControl
                type="number"
                value={config.iterations}
                onChange={handleIterationsChange}
                min={100}
                max={100000}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Threads</Form.Label>
              <ThemedFormControl
                type="number"
                value={config.threads}
                onChange={handleThreadsChange}
                min={1}
                max={navigator.hardwareConcurrency || 8}
              />
            </Form.Group>
          </Form>
        </ThemedCard.Body>
      </ThemedCard>
    </Container>
  );
}; 