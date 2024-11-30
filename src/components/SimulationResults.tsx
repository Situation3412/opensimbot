import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Table } from './ui/Table';
import { useConfig } from '../contexts/ConfigContext';

interface BaseResult {
  dps: number;
  error: number;
}

interface GearSetResult extends BaseResult {
  items: {
    slot: string;
    name: string;
    ilevel: number;
  }[];
}

interface Props {
  type: 'single' | 'gearset' | 'upgrade';
  data: BaseResult | GearSetResult[];
  className?: string;
}

export const SimulationResults: React.FC<Props> = ({ type, data, className = '' }) => {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const formatNumber = (num: number) => num.toLocaleString(undefined, { 
    maximumFractionDigits: 0 
  });

  if (type === 'single') {
    const result = data as BaseResult;
    return (
      <Card className={className}>
        <Card.Header>Simulation Results</Card.Header>
        <Card.Body>
          <div className="flex justify-between items-center">
            <div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                DPS
              </div>
              <div className="text-3xl font-bold text-green-500">
                {formatNumber(result.dps)}
              </div>
            </div>
            <Badge variant="info">
              ±{result.error.toFixed(2)}%
            </Badge>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (type === 'gearset') {
    const results = data as GearSetResult[];
    const baseline = results[0].dps;

    return (
      <Card className={className}>
        <Card.Header>Top Gear Sets</Card.Header>
        <Card.Body>
          <Table
            data={results}
            columns={[
              {
                key: 'dps',
                header: 'DPS',
                render: (result) => (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{formatNumber(result.dps)}</span>
                    {result.dps !== baseline && (
                      <Badge variant="success">
                        +{((result.dps / baseline - 1) * 100).toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                )
              },
              {
                key: 'error',
                header: 'Error',
                render: (result) => (
                  <Badge variant="info">±{result.error.toFixed(2)}%</Badge>
                )
              },
              {
                key: 'items',
                header: 'Changed Items',
                render: (result) => (
                  <div className="space-y-1">
                    {result.items.map((item, i) => (
                      <div key={i} className="text-sm">
                        {item.slot}: {item.name} ({item.ilevel})
                      </div>
                    ))}
                  </div>
                )
              }
            ]}
          />
        </Card.Body>
      </Card>
    );
  }

  return null;
}; 