import React from 'react';
import { TextArea } from './ui/TextArea';

interface CharacterInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const CharacterInput: React.FC<CharacterInputProps> = ({
  value,
  onChange,
  error,
  disabled = false
}) => {
  return (
    <TextArea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label="Character Import String"
      rows={10}
      placeholder="Paste your SimC addon export here..."
      helpText="You can get this from the in-game SimC addon using /simc"
      error={error}
      hideScrollbar
      disabled={disabled}
    />
  );
};