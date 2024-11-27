import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { ThemedCard } from '../components/ThemedCard';
import { useConfig } from '../contexts/ConfigContext';

export const SingleSim: React.FC = () => {
  const { config } = useConfig();
  
  return (
    <Container className="py-4">
      <ThemedCard>
        <ThemedCard.Header>Single Sim</ThemedCard.Header>
        <ThemedCard.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Character Import String</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Paste your SimC import string here..."
              />
              <Form.Text className={config.theme === 'dark' ? 'text-light' : 'text-muted'}>
                You can get this from the in-game SimC addon
              </Form.Text>
            </Form.Group>
            
            <Button variant={config.theme === 'dark' ? 'primary' : 'primary'}>
              Run Simulation
            </Button>
          </Form>
        </ThemedCard.Body>
      </ThemedCard>
    </Container>
  );
}; 