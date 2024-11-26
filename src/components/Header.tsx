import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-secondary">
      <Container>
        <Navbar.Brand as={Link} to="/">SimCraft UI</Navbar.Brand>
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