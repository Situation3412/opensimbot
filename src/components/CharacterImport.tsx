import React from 'react';
import { Form } from 'react-bootstrap';
import { ThemedFormControl } from './ThemedFormControl';
import { useConfig } from '../contexts/ConfigContext';

interface Props {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export const CharacterImport: React.FC<Props> = ({ value, onChange, rows = 10 }) => {
  const { config } = useConfig();

  return (
    <Form.Group className="mb-3">
      <Form.Label>Character Import String</Form.Label>
      <ThemedFormControl
        as="textarea"
        rows={rows}
        placeholder="Paste your SimC addon export here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Form.Text className={config.theme === 'dark' ? 'text-light' : 'text-muted'}>
        You can get this from the in-game SimC addon using /simc
      </Form.Text>
    </Form.Group>
  );
}; 