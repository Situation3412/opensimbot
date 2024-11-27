import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';

export const Header: React.FC = () => {
  const { config } = useConfig();
  
  return (
    <Navbar 
      bg={config.theme} 
      variant={config.theme} 
      expand="lg" 
      className={`border-bottom ${config.theme === 'dark' ? 'border-secondary' : 'border-light'}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">Open SimBot</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/best-in-bag">Best in Bag</Nav.Link>
            <Nav.Link as={Link} to="/single-sim">Single Sim</Nav.Link>
            <Nav.Link as={Link} to="/upgrade-finder">Upgrade Finder</Nav.Link>
            <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}; 