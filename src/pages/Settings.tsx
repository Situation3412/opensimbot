import React from 'react';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useConfig } from '../contexts/ConfigContext';
import { useToast } from '../contexts/ToastContext';
import { useForm } from '../contexts/FormContext';

interface SettingsFormData {
  theme: 'light' | 'dark' | 'system';
  iterations: number;
  threads: number;
  simcPath: string;
}

export const Settings: React.FC = () => {
  const { config, updateConfig } = useConfig();
  const { showToast } = useToast();

  const { register, handleSubmit, formState: { isSubmitting, errors, isDirty } } = useForm<SettingsFormData>({
    defaultValues: {
      theme: config.theme,
      iterations: config.iterations,
      threads: config.threads,
      simcPath: config.simcPath || ''
    },
    validationRules: {
      iterations: {
        required: 'Number of iterations is required',
        min: {
          value: 100,
          message: 'Minimum iterations is 100'
        },
        max: {
          value: 100000,
          message: 'Maximum iterations is 100,000'
        }
      },
      threads: {
        required: 'Number of threads is required',
        min: {
          value: 1,
          message: 'Minimum threads is 1'
        },
        max: {
          value: 32,
          message: 'Maximum threads is 32'
        }
      }
    }
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await updateConfig(data);
      showToast('success', 'Settings saved successfully');
    } catch (error) {
      showToast('error', 'Failed to save settings');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Card>
        <Card.Header>
          <h2 className="text-xl font-medium">Settings</h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Theme Settings */}
            <section>
              <h3 className="text-lg font-medium mb-4">Appearance</h3>
              <Select
                {...register('theme')}
                label="Theme"
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' }
                ]}
                helpText="Choose your preferred color theme"
                error={errors.theme?.message}
              />
            </section>

            {/* SimC Settings */}
            <section>
              <h3 className="text-lg font-medium mb-4">Simulation Settings</h3>
              <div className="space-y-4">
                <Input
                  {...register('iterations')}
                  type="number"
                  label="Iterations"
                  min={100}
                  max={100000}
                  helpText="Higher values provide more accurate results but take longer"
                  error={errors.iterations?.message}
                />
                
                <Input
                  {...register('threads')}
                  type="number"
                  label="Threads"
                  min={1}
                  max={32}
                  helpText="Number of CPU threads to use for simulations"
                  error={errors.threads?.message}
                />
              </div>
            </section>

            {/* Installation Settings */}
            <section>
              <h3 className="text-lg font-medium mb-4">Installation</h3>
              <Input
                {...register('simcPath')}
                label="SimulationCraft Path"
                placeholder="/usr/local/bin/simc"
                helpText="Path to your SimulationCraft executable"
                error={errors.simcPath?.message}
              />
            </section>

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}; 