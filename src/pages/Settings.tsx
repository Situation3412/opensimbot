import React from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

export const Settings = () => {
  return (
    <Container className="py-4">
      <h2 className="mb-4">Settings</h2>
      <Card bg="dark" text="light" className="border-secondary">
        <Card.Header>SimulationCraft Settings</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>SimulationCraft Path</Form.Label>
              <Form.Control
                type="text"
                placeholder="/path/to/simc"
                className="bg-dark text-light border-secondary"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Default Iterations</Form.Label>
              <Form.Control
                type="number"
                defaultValue={10000}
                className="bg-dark text-light border-secondary"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Threads</Form.Label>
              <Form.Control
                type="number"
                defaultValue={4}
                className="bg-dark text-light border-secondary"
              />
            </Form.Group>
            <Button variant="primary" type="submit">Save Settings</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}; 