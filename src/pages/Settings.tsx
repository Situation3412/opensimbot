import React from 'react';
import { Container, Card, Form } from 'react-bootstrap';
import { useSimc } from '../contexts/SimcContext';
import { useConfig } from '../contexts/ConfigContext';

export const Settings: React.FC = () => {
  const { currentVersion } = useSimc();
  const { config, updateConfig } = useConfig();

  return (
    <Container className="py-4">
      <Card bg="dark" text="light" className="mb-4">
        <Card.Header>SimulationCraft Settings</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Installed Version</Form.Label>
              <Form.Control
                type="text"
                value={currentVersion 
                  ? `${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}`
                  : 'Not installed'
                }
                readOnly
                plaintext
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Iterations</Form.Label>
              <Form.Control
                type="number"
                value={config.iterations}
                onChange={(e) => updateConfig({ iterations: parseInt(e.target.value) })}
                min={100}
                max={100000}
              />
              <Form.Text className="text-muted">
                Higher values provide more accurate results but take longer to simulate
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Threads</Form.Label>
              <Form.Control
                type="number"
                value={config.threads}
                onChange={(e) => updateConfig({ threads: parseInt(e.target.value) })}
                min={1}
                max={navigator.hardwareConcurrency || 8}
              />
              <Form.Text className="text-muted">
                Maximum recommended threads: {navigator.hardwareConcurrency || 8}
              </Form.Text>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}; 