import React from 'react';
import { Container } from 'react-bootstrap';
import { SimulationForm } from './components/SimulationForm';
import { Header } from './components/Header';
import { SimulationResults } from './components/SimulationResults';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App bg-dark text-light min-vh-100">
      <Header />
      <Container fluid className="py-4">
        <div className="row g-4">
          <div className="col-md-6">
            <SimulationForm />
          </div>
          <div className="col-md-6">
            <SimulationResults />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
