import React from 'react';
import './PigeonCanvas.css';

const PigeonCanvas = ({ baseBody, elements }) => {
  if (!baseBody) {
    return (
      <div className="pigeon-canvas">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  const renderElements = () => {
    if (!elements || elements.length === 0) {
      return null;
    }

    return elements.map((element, index) => (
      <img
        key={`${element.id}-${index}`}
        src={element.sprite}
        alt={element.name}
        className="decorative-element"
        style={{
          position: 'absolute',
          left: element.position.x,
          top: element.position.y,
          filter: element.color ? `hue-rotate(${element.color}deg)` : 'none',
          zIndex: 10
        }}
      />
    ));
  };

  return (
    <div className="pigeon-canvas">
      <div className="canvas-area">
        <div className="base-body-container">
          <img
            src={baseBody.sprite}
            alt={baseBody.name}
            className="base-body"
          />
          {renderElements()}
        </div>
      </div>
      <div className="canvas-info">
        <p>Текущее базовое тело: {baseBody.name}</p>
      </div>
    </div>
  );
};

export default PigeonCanvas;