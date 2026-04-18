import React from 'react';
import '../styles/App.css';

const IngredientCard = ({ name, icon }) => (
  <div className="floating-card">
    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{icon}</div>
    <span style={{ fontSize: '0.9rem', textAlign: 'center', fontWeight: '500' }}>{name}</span>
  </div>
);

export default IngredientCard;