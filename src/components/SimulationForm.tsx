import React from 'react';
import { Card } from './ui/Card';
import { TextArea } from './ui/TextArea';
import { Button } from './ui/Button';
import { useForm } from '../contexts/FormContext';

interface SimulationFormData {
  characterData: string;
}

export const SimulationForm: React.FC = () => {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<SimulationFormData>({
    defaultValues: {
      characterData: ''
    },
    validationRules: {
      characterData: {
        required: 'Character data is required',
        minLength: {
          value: 10,
          message: 'Character data seems too short'
        }
      }
    }
  });

  const onSubmit = async (data: SimulationFormData) => {
    // TODO: Implement simulation logic
    console.log('Submitting:', data);
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="text-lg font-medium">Character Import</h4>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextArea
            {...register('characterData')}
            label="Character Data"
            placeholder="Paste your character data here..."
            rows={10}
            error={errors.characterData?.message}
            helpText="Paste the output from your SimC addon here"
          />
          
          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Running Simulation...' : 'Run Simulation'}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
}; 