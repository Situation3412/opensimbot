import React from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Checkbox } from './ui/Checkbox';
import { Tooltip } from './ui/Tooltip';
import { BsInfoCircle } from 'react-icons/bs';
import { useConfig } from '../contexts/ConfigContext';

interface BaseOptionProps {
  label: string;
  tooltip: string;
  error?: string;
  className?: string;
}

interface NumberOptionProps extends BaseOptionProps {
  type: 'number';
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

interface SelectOptionProps extends BaseOptionProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

interface CheckboxOptionProps extends BaseOptionProps {
  type: 'checkbox';
  checked: boolean;
  onChange: (checked: boolean) => void;
}

type SimulationOptionProps = NumberOptionProps | SelectOptionProps | CheckboxOptionProps;

export const SimulationOption: React.FC<SimulationOptionProps> = (props) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const labelWithTooltip = (
    <div className="flex items-center space-x-2">
      <span>{props.label}</span>
      <Tooltip content={props.tooltip}>
        <BsInfoCircle className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </Tooltip>
    </div>
  );

  switch (props.type) {
    case 'number':
      return (
        <Input
          type="number"
          label={labelWithTooltip}
          value={props.value}
          onChange={(e) => props.onChange(parseFloat(e.target.value))}
          min={props.min}
          max={props.max}
          step={props.step}
          error={props.error}
          className={props.className}
        />
      );

    case 'select':
      return (
        <Select
          label={labelWithTooltip}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          options={props.options}
          error={props.error}
          className={props.className}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          label={labelWithTooltip}
          checked={props.checked}
          onChange={(e) => props.onChange(e.target.checked)}
          error={props.error}
          className={props.className}
        />
      );
  }
}; 