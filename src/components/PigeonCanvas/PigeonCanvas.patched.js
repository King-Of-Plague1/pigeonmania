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

  const getColorFilter = (color, brightness = 1) => {
    if (!color) return 'none';
    
    // Преобразуем серый спрайт в цветной
    return `
      sepia(100%) 
      hue-rotate(${color}deg) 
      saturate(1.5) 
      brightness(${brightness})
    `.replace(/\s+/g, ' ').trim();
  };

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
          filter: getColorFilter(element.color, element.brightness ?? 1),
          opacity: element.opacity ?? 1.0, // <--- добавлено
          zIndex: 10,
          transition: 'filter 0.3s ease, opacity 0.3s ease'
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
    const info = [`Базовое тело: ${baseBody.name}`];
    
    if (baseBody.color) {
      const colorName = getColorName(parseInt(baseBody.color));
      info.push(`🎨 Цвет тела: ${colorName} (${baseBody.color}°)`);
    } else {
      info.push(`⚪ Цвет тела: исходный серый`);
    }
    
    if (activeSegmentId && baseBody.segments && baseBody.segments[activeSegmentId]) {
      info.push(`🎯 Активный сегмент: ${baseBody.segments[activeSegmentId].name}`);
    }
    
    if (elements && elements.length > 0) {
      info.push(`✨ Декоративных элементов: ${elements.length}`);
      
      const coloredElements = elements.filter(el => el.color);
      if (coloredElements.length > 0) {
        info.push(`🌈 Окрашенных элементов: ${coloredElements.length}`);
      }
    }
    
    return info;
  };

  const getColorName = (hue) => {
    if (hue >= 0 && hue < 30) return 'Красный';
    if (hue >= 30 && hue < 60) return 'Оранжевый';
    if (hue >= 60 && hue < 90) return 'Желтый';
    if (hue >= 90 && hue < 150) return 'Зеленый';
    if (hue >= 150 && hue < 210) return 'Голубой';
    if (hue >= 210 && hue < 270) return 'Синий';
    if (hue >= 270 && hue < 330) return 'Фиолетовый';
    return 'Пурпурный';
  };
  console.log('Base body brightness:', baseBody.brightness);
  return (
    <div className="pigeon-canvas">
      <div className="canvas-area">
        <div className="base-body-container" style={{ transform: `scale(${baseBody.scale ?? 1})`, transformOrigin: "top left" }}>
          <img
            src={baseBody.sprite}
            alt={baseBody.name}
            className="base-body"
            style={{
              filter: getColorFilter(baseBody.color, baseBody.brightness ?? 1),
              transition: "filter 0.3s ease",
              transform: `scale(${baseBody.scale ?? 1})`,
              transformOrigin: "top left"
            }}
            style={{
              filter: getColorFilter(baseBody.color, baseBody.brightness ?? 1),
              transition: 'filter 0.3s ease'
            }}
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
