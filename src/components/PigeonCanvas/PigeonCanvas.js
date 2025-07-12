import React from 'react';
import './PigeonCanvas.css';

const PigeonCanvas = ({ baseBody, elements, activeSegmentId }) => {
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

  const renderSegmentHighlight = () => {
    if (!activeSegmentId || !baseBody.segments) {
      return null;
    }

    const segment = baseBody.segments[activeSegmentId];
    if (!segment || !segment.highlightArea) {
      return null;
    }

    return (
      <div
        className="segment-highlight"
        style={{
          position: 'absolute',
          left: segment.highlightArea.x,
          top: segment.highlightArea.y,
          width: segment.highlightArea.width,
          height: segment.highlightArea.height,
          border: '2px dashed #007bff',
          borderRadius: '4px',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      />
    );
  };

  const getActiveSegmentName = () => {
    if (!activeSegmentId || !baseBody.segments) {
      return null;
    }
    
    const segment = baseBody.segments[activeSegmentId];
    return segment ? segment.name : null;
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
          {renderSegmentHighlight()}
          {renderElements()}
        </div>
      </div>
      <div className="canvas-info">
        <p>Текущее базовое тело: {baseBody.name}</p>
        {getActiveSegmentName() && (
          <p>Активный сегмент: {getActiveSegmentName()}</p>
        )}
      </div>
    </div>
  );
};

export default PigeonCanvas;