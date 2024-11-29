import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { ThemedCard } from '../components/ThemedCard';
import { CharacterImport } from '../components/CharacterImport';
import { SimulationOutput } from '../components/SimulationOutput';

export const UpgradeFinder: React.FC = () => {
  const [simcInput, setSimcInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [output, setOutput] = useState('');

  const handleSimulate = async () => {
    // TODO: Implement UpgradeFinder simulation logic
  };
  
  return (
    <Container className="py-4">
      <ThemedCard>
        <ThemedCard.Header>Upgrade Finder</ThemedCard.Header>
        <ThemedCard.Body>
          <Form>
            <CharacterImport 
              value={simcInput}
              onChange={setSimcInput}
            />
            
            <Button 
              variant="primary"
              onClick={handleSimulate}
              disabled={isSimulating || !simcInput.trim()}
            >
              {isSimulating ? 'Finding Upgrades...' : 'Find Upgrades'}
            </Button>

            {(isSimulating || output) && (
              <SimulationOutput output={output} />
            )}
          </Form>
        </ThemedCard.Body>
      </ThemedCard>
    </Container>
  );
}; 