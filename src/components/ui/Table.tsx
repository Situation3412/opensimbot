import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  hoverable?: boolean;
  compact?: boolean;
  striped?: boolean;
}

export function Table<T>({
  data,
  columns,
  className = '',
  hoverable = true,
  compact = false,
  striped = false
}: TableProps<T>) {
  const { config } = useConfig();
  const isDark = config.theme === 'dark';

  const cellPadding = compact ? 'px-4 py-2' : 'px-6 py-4';

  return (
    <div className={`
      w-full overflow-x-auto rounded-lg border
      transition-colors duration-200
      ${isDark 
        ? 'border-gray-700/50 bg-gray-800/50' 
        : 'border-gray-200/50 bg-white'
      }
      ${className}
    `}>
      <table className="min-w-full divide-y divide-gray-200/50">
        <thead className={`
          transition-colors duration-200
          ${isDark ? 'bg-gray-800/50' : 'bg-gray-50/50'}
        `}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                scope="col"
                style={column.width ? { width: column.width } : undefined}
                className={`
                  ${cellPadding} text-xs font-semibold uppercase tracking-wider
                  ${column.align === 'right' ? 'text-right' : ''}
                  ${column.align === 'center' ? 'text-center' : 'text-left'}
                  ${isDark ? 'text-gray-300' : 'text-gray-600'}
                `}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`
          divide-y
          transition-colors duration-200
          ${isDark 
            ? 'divide-gray-700/50' 
            : 'divide-gray-200/50'
          }
        `}>
          {data.map((item, index) => (
            <tr 
              key={index}
              className={`
                transition-colors duration-200
                ${hoverable 
                  ? isDark 
                    ? 'hover:bg-gray-700/50' 
                    : 'hover:bg-gray-50'
                  : ''
                }
                ${striped && index % 2 === 1
                  ? isDark 
                    ? 'bg-gray-800/30' 
                    : 'bg-gray-50/50'
                  : ''
                }
              `}
            >
              {columns.map((column) => (
                <td
                  key={column.key.toString()}
                  className={`
                    ${cellPadding} whitespace-nowrap text-sm
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${column.align === 'center' ? 'text-center' : 'text-left'}
                    ${isDark ? 'text-gray-200' : 'text-gray-900'}
                  `}
                >
                  {column.render
                    ? column.render(item)
                    : (item[column.key as keyof T] as React.ReactNode)
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 