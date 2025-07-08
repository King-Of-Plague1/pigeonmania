import React from 'react';
import './PigeonCanvas.css';
import body1 from '../../assets/sprites/base-bodies/body1.png';

const PigeonCanvas = () => {
  return (
    <div className="pigeon-canvas">
      <div className="pigeon-container">
        <img 
          src={body1} 
          alt="Pigeon base body" 
          className="base-body"
        />
      </div>
    </div>
  );
};

export default PigeonCanvas;