import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Header } from './components/Header';
import { BsGearFill, BsLightningFill, BsSearch } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, link }) => (
  <Col md={6} lg={4} className="mb-4">
    <Card 
      as="a" 
      href={link}
      bg="dark" 
      text="light" 
      className="h-100 border-secondary text-decoration-none"
      style={{ cursor: 'pointer' }}
    >
      <Card.Body className="d-flex flex-column align-items-center text-center p-4">
        <div className="display-4 mb-3 text-primary">
          {icon}
        </div>
        <Card.Title className="h4 mb-3">{title}</Card.Title>
        <Card.Text className="text-muted">{description}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

const features: FeatureCardProps[] = [
  {
    title: 'Best in Bag',
    description: 'Find the optimal combination of gear from your inventory to maximize your performance.',
    icon: <BsGearFill />,
    link: '#best-in-bag'
  },
  {
    title: 'Single Sim',
    description: 'Quickly simulate your current gear setup to analyze your performance.',
    icon: <BsLightningFill />,
    link: '#single-sim'
  },
  {
    title: 'Upgrade Finder',
    description: 'Discover which potential gear upgrades will give you the biggest performance boost.',
    icon: <BsSearch />,
    link: '#upgrade-finder'
  }
];

function App() {
  return (
    <div className="App bg-dark text-light min-vh-100">
      <Header />
      <Container className="py-5">
        <h2 className="text-center mb-5">Choose Your Simulation</h2>
        <Row>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;
