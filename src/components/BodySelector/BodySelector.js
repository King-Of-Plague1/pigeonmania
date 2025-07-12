import React from 'react';
import './BodySelector.css';

const BodySelector = ({ 
  baseBodies, 
  selectedBodyId, 
  onBodySelect 
}) => {
  const handleBodySelect = (bodyId) => {
    onBodySelect(bodyId);
  };

  return (
    <div className="body-selector">
      <h3>Выберите базовое тело</h3>
      <div className="body-options">
        {Object.values(baseBodies).map((body) => (
          <div
            key={body.id}
            className={`body-option ${selectedBodyId === body.id ? 'selected' : ''}`}
            onClick={() => handleBodySelect(body.id)}
          >
            <img 
              src={body.sprite} 
              alt={body.name}
              className="body-preview"
            />
            <span className="body-name">{body.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BodySelector;