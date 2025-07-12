import React, { useRef, useEffect, useState } from 'react';
import './ColorPicker.css';

const ColorPicker = ({
  selectedColor,
  onColorChange,
  onColorReset,
  isVisible
}) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isVisible) {
      drawColorWheel();
    }
  }, [isVisible]);

  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем цветовое колесо с более плавными переходами
    for (let angle = 0; angle < 360; angle += 0.5) {
      const startAngle = (angle - 0.5) * Math.PI / 180;
      const endAngle = angle * Math.PI / 180;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineWidth = 25;
      ctx.strokeStyle = `hsl(${angle}, 85%, 55%)`;
      ctx.stroke();
    }

    // Внутренний белый круг для контраста
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#f8f9fa';
    ctx.fill();
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Отмечаем выбранный цвет
    if (selectedColor) {
      drawColorMarker(ctx, centerX, centerY, radius);
    }
  };

  const drawColorMarker = (ctx, centerX, centerY, radius) => {
    if (!selectedColor) return;

    const hue = parseInt(selectedColor);
    const angle = (hue * Math.PI) / 180;
    const markerRadius = radius - 12;
    
    const x = centerX + Math.cos(angle) * markerRadius;
    const y = centerY + Math.sin(angle) * markerRadius;

    // Белое кольцо
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Внутренний цветной круг
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = `hsl(${hue}, 85%, 55%)`;
    ctx.fill();
  };

  const getColorFromPosition = (x, y) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const clickX = x - rect.left - centerX;
    const clickY = y - rect.top - centerY;
    
    const distance = Math.sqrt(clickX * clickX + clickY * clickY);
    const minRadius = 40; // Внутренний радиус
    const maxRadius = 85; // Внешний радиус
    
    // Проверяем, что клик в области цветового кольца
    if (distance < minRadius || distance > maxRadius) {
      return null;
    }
    
    const angle = Math.atan2(clickY, clickX);
    const hue = ((angle * 180 / Math.PI) + 360) % 360;
    
    return Math.round(hue);
  };

  const handleCanvasClick = (event) => {
    const hue = getColorFromPosition(event.clientX, event.clientY);
    if (hue !== null) {
      onColorChange(hue.toString());
    }
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    handleCanvasClick(event);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      handleCanvasClick(event);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="color-picker">
      <h3>Выбор цвета</h3>
      <div className="color-content">
        <div className="color-wheel-container">
          <canvas
            ref={canvasRef}
            width={180}
            height={180}
            className="color-wheel"
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          />
        </div>
        <div className="color-details">
          <div className="color-preview">
            <div 
              className="current-color"
              style={{
                background: selectedColor 
                  ? `hsl(${selectedColor}, 85%, 55%)`
                  : 'linear-gradient(45deg, #f8f9fa 25%, #e9ecef 25%, #e9ecef 50%, #f8f9fa 50%, #f8f9fa 75%, #e9ecef 75%)',
                backgroundSize: selectedColor ? 'auto' : '8px 8px'
              }}
            />
            <span className="color-value">
              {selectedColor ? `Оттенок: ${selectedColor}°` : 'Исходный серый'}
            </span>
          </div>
          <div className="color-actions">
            <button 
              className="reset-button"
              onClick={onColorReset}
              disabled={!selectedColor}
            >
              Сбросить цвет
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;