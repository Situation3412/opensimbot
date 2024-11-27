import React from 'react';
import { Card, CardProps } from 'react-bootstrap';
import { useConfig } from '../contexts/ConfigContext';
import './ThemedCard.css';

interface ThemedCardProps extends CardProps {
  children: React.ReactNode;
}

const ThemedHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useConfig();
  return (
    <Card.Header className={config.theme === 'dark' ? 'border-secondary' : 'border-primary'}>
      {children}
    </Card.Header>
  );
};

const ThemedBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useConfig();
  
  return (
    <Card.Body className={config.theme === 'dark' ? 'themed-card-body-dark' : ''}>
      {children}
    </Card.Body>
  );
};

const ThemedCardComponent: React.FC<ThemedCardProps> & {
  Header: typeof ThemedHeader;
  Body: typeof ThemedBody;
} = ({ children, className = '', ...props }) => {
  const { config } = useConfig();
  
  return (
    <Card 
      bg={config.theme}
      text={config.theme === 'dark' ? 'light' : 'dark'}
      className={`${className} border-${config.theme === 'dark' ? 'secondary' : 'primary'}`}
      {...props}
    >
      {children}
    </Card>
  );
};

ThemedCardComponent.Header = ThemedHeader;
ThemedCardComponent.Body = ThemedBody;

export const ThemedCard = ThemedCardComponent; 