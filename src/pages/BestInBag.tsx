import React from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { PageTitle } from '../components/PageTitle';

export const BestInBag = () => {
  return (
    <Container className="py-4">
      <PageTitle title="Best in Bag" />
      <h2 className="mb-4">Best in Bag</h2>
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
                <Button variant="primary" type="submit">Run Best in Bag</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card bg="dark" text="light" className="border-secondary">
            <Card.Header>Options</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox"
                    label="Include Bank Items"
                    id="includeBankItems"
                  />
                  <Form.Check 
                    type="checkbox"
                    label="Include Equipped Items"
                    id="includeEquippedItems"
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