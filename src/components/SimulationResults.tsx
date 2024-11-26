import React from 'react';
import { Card } from 'react-bootstrap';

export const SimulationResults: React.FC = () => {
  return (
    <Card bg="dark" text="light" className="border-secondary h-100">
      <Card.Header>
        <h4 className="mb-0">Simulation Results</h4>
      </Card.Header>
      <Card.Body>
        <div className="bg-secondary bg-opacity-25 p-4 rounded">
          <p className="mb-0">No simulation results available yet.</p>
        </div>
      </Card.Body>
    </Card>
  );
}; 