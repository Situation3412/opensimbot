import React from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { PageTitle } from '../components/PageTitle';

export const UpgradeFinder = () => {
  return (
    <Container className="py-4">
      <PageTitle title="Upgrade Finder" />
      <h2 className="mb-4">Upgrade Finder</h2>
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
                <Button variant="primary" type="submit">Find Upgrades</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card bg="dark" text="light" className="border-secondary">
            <Card.Header>Search Options</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Source</Form.Label>
                  <Form.Select className="bg-dark text-light border-secondary">
                    <option>Raid Finder</option>
                    <option>Normal Raid</option>
                    <option>Heroic Raid</option>
                    <option>Mythic Raid</option>
                    <option>Mythic+</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox"
                    label="Include Crafted Items"
                    id="includeCrafted"
                    defaultChecked
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