import React from 'react';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { CharacterInput } from '../components/CharacterInput';
import { SimulationOption } from '../components/SimulationOption';
import { useForm } from '../contexts/FormContext';
import { useToast } from '../contexts/ToastContext';

interface GearSlot {
  id: string;
  label: string;
  enabled: boolean;
}

interface UpgradeFinderFormData {
  characterData: string;
  options: {
    includeWorldDrops: boolean;
    includePvP: boolean;
    minIlvl: number;
    maxIlvl: number;
    slots: GearSlot[];
  };
}

const defaultGearSlots: GearSlot[] = [
  { id: 'head', label: 'Head', enabled: true },
  { id: 'neck', label: 'Neck', enabled: true },
  { id: 'shoulders', label: 'Shoulders', enabled: true },
  { id: 'back', label: 'Back', enabled: true },
  { id: 'chest', label: 'Chest', enabled: true },
  { id: 'wrists', label: 'Wrists', enabled: true },
  { id: 'hands', label: 'Hands', enabled: true },
  { id: 'waist', label: 'Waist', enabled: true },
  { id: 'legs', label: 'Legs', enabled: true },
  { id: 'feet', label: 'Feet', enabled: true },
  { id: 'finger1', label: 'Ring 1', enabled: true },
  { id: 'finger2', label: 'Ring 2', enabled: true },
  { id: 'trinket1', label: 'Trinket 1', enabled: true },
  { id: 'trinket2', label: 'Trinket 2', enabled: true },
  { id: 'mainhand', label: 'Main Hand', enabled: true },
  { id: 'offhand', label: 'Off Hand', enabled: true }
];

export const UpgradeFinder: React.FC = () => {
  const { showToast } = useToast();
  
  const { register, handleSubmit, formState: { isSubmitting, errors }, setValue } = useForm<UpgradeFinderFormData>({
    defaultValues: {
      characterData: '',
      options: {
        includeWorldDrops: true,
        includePvP: false,
        minIlvl: 0,
        maxIlvl: 500,
        slots: defaultGearSlots
      }
    },
    validationRules: {
      characterData: {
        required: 'Character data is required'
      },
      'options.minIlvl': {
        min: {
          value: 0,
          message: 'Minimum item level cannot be negative'
        }
      },
      'options.maxIlvl': {
        max: {
          value: 500,
          message: 'Maximum item level cannot exceed 500'
        },
        validate: (value: number, formValues: UpgradeFinderFormData) => {
          if (value <= formValues.options.minIlvl) {
            return 'Maximum item level must be greater than minimum';
          }
          return undefined;
        }
      }
    }
  });

  const slots = register('options.slots').value || defaultGearSlots;

  const onSubmit = async (data: UpgradeFinderFormData) => {
    try {
      // TODO: Implement upgrade finder logic
      console.log('Finding upgrades with:', data);
      showToast('success', 'Started upgrade search');
    } catch (error) {
      showToast('error', 'Failed to start upgrade search');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Card>
        <Card.Header>
          <h2 className="text-xl font-medium">Upgrade Finder</h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs
              tabs={[
                {
                  id: 'input',
                  label: 'Character Input',
                  content: (
                    <div className="space-y-6">
                      <CharacterInput
                        value={register('characterData').value}
                        onChange={(value) => register('characterData').onChange(value)}
                        error={errors.characterData?.message}
                        disabled={isSubmitting}
                      />
                    </div>
                  )
                },
                {
                  id: 'options',
                  label: 'Search Options',
                  content: (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SimulationOption
                          type="number"
                          label="Minimum Item Level"
                          tooltip="Minimum item level to search for"
                          value={register('options.minIlvl').value}
                          onChange={value => register('options.minIlvl').onChange(value)}
                          min={0}
                          max={500}
                          error={errors['options.minIlvl']?.message}
                        />
                        <SimulationOption
                          type="number"
                          label="Maximum Item Level"
                          tooltip="Maximum item level to search for"
                          value={register('options.maxIlvl').value}
                          onChange={value => register('options.maxIlvl').onChange(value)}
                          min={0}
                          max={500}
                          error={errors['options.maxIlvl']?.message}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Content Sources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <SimulationOption
                            type="checkbox"
                            label="Include World Drops"
                            tooltip="Include items from world content"
                            checked={register('options.includeWorldDrops').value}
                            onChange={checked => register('options.includeWorldDrops').onChange(checked)}
                          />
                          <SimulationOption
                            type="checkbox"
                            label="Include PvP"
                            tooltip="Include items from PvP content"
                            checked={register('options.includePvP').value}
                            onChange={checked => register('options.includePvP').onChange(checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Gear Slots</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {slots.map((slot: GearSlot, index: number) => {
                            const slotDef = defaultGearSlots.find(s => s.id === slot.id);
                            if (!slotDef) return null;
                            
                            return (
                              <SimulationOption
                                key={slot.id}
                                type="checkbox"
                                label={slotDef.label}
                                tooltip={`Include ${slotDef.label} slot in search`}
                                checked={slot.enabled}
                                onChange={checked => {
                                  const newSlots = [...slots];
                                  newSlots[index] = { ...slot, enabled: checked };
                                  setValue('options.slots', newSlots);
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )
                }
              ]}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Finding Upgrades...' : 'Find Upgrades'}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}; 