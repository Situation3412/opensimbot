import React from 'react';
import { SimulationForm } from './components/SimulationForm';
import { Header } from './components/Header';
import { SimulationResults } from './components/SimulationResults';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="app-main">
        <SimulationForm />
        <SimulationResults />
      </main>
    </div>
  );
}

export default App;
