import React, { useState } from 'react';
import ColorPicker from '../ColorPicker/ColorPicker';
import './ColorManager.css';

const getColorFilter = (color) => {
    if (!color) return 'none';
    
    return `
      sepia(100%) 
      hue-rotate(${color}deg) 
      saturate(1.5) 
      brightness(1.1)
    `.replace(/\s+/g, ' ').trim();
  };


const ColorManager = ({
  baseBody,
  activeSegmentId,
  currentElements,
  onBaseBodyColorChange,
  onElementColorChange
}) => {
  const [colorTarget, setColorTarget] = useState(null); // 'baseBody' или elementId
  const [selectedColor, setSelectedColor] = useState(null);

  const handleTargetSelect = (target) => {
    setColorTarget(target);
    
    // Получаем текущий цвет выбранного объекта
    if (target === 'baseBody') {
      setSelectedColor(baseBody?.color || null);
    } else {
      const element = currentElements.find(el => el.id === target);
      setSelectedColor(element?.color || null);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    
    if (colorTarget === 'baseBody') {
      onBaseBodyColorChange(color);
    } else if (colorTarget) {
      onElementColorChange(colorTarget, color);
    }
  };

  const handleColorReset = () => {
    setSelectedColor(null);
    
    if (colorTarget === 'baseBody') {
      onBaseBodyColorChange(null);
    } else if (colorTarget) {
      onElementColorChange(colorTarget, null);
    }
  };

  const getTargetName = (target) => {
    if (target === 'baseBody') {
      return baseBody?.name || 'Базовое тело';
    }
    
    const element = currentElements.find(el => el.id === target);
    return element?.name || 'Элемент';
  };

  return (
    <div className="color-manager">
      <h3>Настройка цвета</h3>
      <div className="color-info">
        💡 Выберите объект и примените цвет из цветового круга
      </div>
      
      <div className="color-targets">
        {/* Базовое тело */}
        {baseBody && (
          <div
            className={`target-option ${colorTarget === 'baseBody' ? 'selected' : ''}`}
            onClick={() => handleTargetSelect('baseBody')}
          >
            <div className="target-preview">
              <img 
                src={baseBody.sprite} 
                alt={baseBody.name}
                className="target-image"
                style={{
                  filter: getColorFilter(baseBody.color)
                }}
              />
            </div>
            <span className="target-name">{baseBody.name}</span>
            <div className="target-type">Базовое тело</div>
          </div>
        )}

        {/* Декоративные элементы */}
        {currentElements.map((element) => (
          <div
            key={element.id}
            className={`target-option ${colorTarget === element.id ? 'selected' : ''}`}
            onClick={() => handleTargetSelect(element.id)}
          >
            <div className="target-preview">
              <img 
                src={element.sprite} 
                alt={element.name}
                className="target-image"
                style={{
                  filter: getColorFilter(element.color)
                }}
              />
            </div>
            <span className="target-name">{element.name}</span>
            <div className="target-type">Декор</div>
          </div>
        ))}
      </div>

      {(!baseBody && currentElements.length === 0) && (
        <div className="no-targets">
          Нет доступных объектов для окрашивания
        </div>
      )}

      {colorTarget && (
        <div className="selected-target-info">
          <strong>Выбран:</strong> {getTargetName(colorTarget)}
        </div>
      )}

      <ColorPicker
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        onColorReset={handleColorReset}
        isVisible={!!colorTarget}
      />
    </div>
  );
};

export default ColorManager;