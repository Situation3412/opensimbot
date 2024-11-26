import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

export const SimulationForm: React.FC = () => {
  const [characterData, setCharacterData] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement simulation logic
    console.log('Simulating character:', characterData);
  };

  return (
    <Card bg="dark" text="light" className="border-secondary h-100">
      <Card.Header>
        <h4 className="mb-0">Character Import</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              value={characterData}
              onChange={(e) => setCharacterData(e.target.value)}
              placeholder="Paste your character data here..."
              rows={10}
              className="bg-dark text-light border-secondary"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Run Simulation
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}; 