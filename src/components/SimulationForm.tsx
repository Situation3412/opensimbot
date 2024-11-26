import React, { useState } from 'react';
import './SimulationForm.css';

export const SimulationForm: React.FC = () => {
  const [characterData, setCharacterData] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement simulation logic
    console.log('Simulating character:', characterData);
  };

  return (
    <div className="simulation-form">
      <h2>Character Import</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={characterData}
          onChange={(e) => setCharacterData(e.target.value)}
          placeholder="Paste your character data here..."
          rows={10}
        />
        <button type="submit">Run Simulation</button>
      </form>
    </div>
  );
}; 