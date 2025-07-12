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

  const renderSegmentHighlights = () => {
    if (!activeSegmentId || !baseBody.segments) {
      return null;
    }

    const activeSegment = baseBody.segments[activeSegmentId];
    if (!activeSegment || !activeSegment.highlightArea) {
      return null;
    }

    return (
      <div
        className="segment-highlight"
        style={{
          position: 'absolute',
          left: activeSegment.highlightArea.x,
          top: activeSegment.highlightArea.y,
          width: activeSegment.highlightArea.width,
          height: activeSegment.highlightArea.height,
          background: 'rgba(0, 123, 255, 0.2)',
          border: '2px dashed #007bff',
          borderRadius: '4px',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      />
    );
  };

  const getCanvasInfo = () => {
    const info = [`Текущее базовое тело: ${baseBody.name}`];
    
    if (activeSegmentId && baseBody.segments && baseBody.segments[activeSegmentId]) {
      info.push(`Активный сегмент: ${baseBody.segments[activeSegmentId].name}`);
    }
    
    if (elements && elements.length > 0) {
      info.push(`Декоративных элементов: ${elements.length}`);
    }
    
    return info;
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
          {renderSegmentHighlights()}
          {renderElements()}
        </div>
      </div>
      <div className="canvas-info">
        {getCanvasInfo().map((info, index) => (
          <p key={index}>{info}</p>
        ))}
      </div>
    </div>
  );
};

export default PigeonCanvas;