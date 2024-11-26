import React from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { PageTitle } from '../components/PageTitle';

export const SingleSim = () => {
  return (
    <Container className="py-4">
      <PageTitle title="Single Sim" />
      <h2 className="mb-4">Single Sim</h2>
      <Row>
        <Col lg={8}>
          <Card bg="dark" text="light" className="border-secondary mb-4">
            <Card.Header>Character Import</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={10}
                    placeholder="Paste your character data here..."
                    className="bg-dark text-light border-secondary"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Run Simulation</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card bg="dark" text="light" className="border-secondary">
            <Card.Header>Simulation Options</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Fight Style</Form.Label>
                  <Form.Select className="bg-dark text-light border-secondary">
                    <option>Patchwerk</option>
                    <option>Hectic Add Cleave</option>
                    <option>Light Movement</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fight Length</Form.Label>
                  <Form.Control 
                    type="number" 
                    defaultValue={300}
                    className="bg-dark text-light border-secondary"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}; 