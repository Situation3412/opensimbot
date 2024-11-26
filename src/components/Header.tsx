import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <h1>SimCraft UI</h1>
      <nav>
        <ul>
          <li>Best in Bag</li>
          <li>Single Sim</li>
          <li>Upgrade Finder</li>
          <li>Settings</li>
        </ul>
      </nav>
    </header>
  );
}; 