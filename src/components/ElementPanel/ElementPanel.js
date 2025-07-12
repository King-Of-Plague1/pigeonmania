import React from 'react';
import './ElementPanel.css';

const ElementPanel = ({ 
  decorativeElements,
  activeSegmentId,
  onElementAdd,
  onElementRemove,
  currentElements
}) => {
  const handleElementAdd = (elementId) => {
    onElementAdd(elementId);
  };

  const handleElementRemove = (elementId) => {
    onElementRemove(elementId);
  };

  const getElementsForActiveSegment = () => {
    if (!activeSegmentId || !decorativeElements) {
      return [];
    }
    
    return Object.values(decorativeElements).filter(element => 
      element.segmentType === activeSegmentId
    );
  };

  const isElementActive = (elementId) => {
    return currentElements.some(element => element.spriteId === elementId);
  };

  const availableElements = getElementsForActiveSegment();

  if (!activeSegmentId) {
    return (
      <div className="element-panel">
        <h3>Декоративные элементы</h3>
        <div className="no-segment">
          Выберите сегмент для редактирования
        </div>
      </div>
    );
  }

  if (availableElements.length === 0) {
    return (
      <div className="element-panel">
        <h3>Декоративные элементы</h3>
        <div className="no-elements">
          Нет доступных элементов для этого сегмента
        </div>
      </div>
    );
  }

  return (
    <div className="element-panel">
      <h3>Декоративные элементы</h3>
      <div className="element-grid">
        {availableElements.map((element) => {
          const isActive = isElementActive(element.id);
          
          return (
            <div
              key={element.id}
              className={`element-item ${isActive ? 'active' : ''}`}
            >
              <div className="element-preview">
                <img 
                  src={element.sprite} 
                  alt={element.name}
                  className="element-image"
                />
              </div>
              <div className="element-info">
                <span className="element-name">{element.name}</span>
                <div className="element-actions">
                  {isActive ? (
                    <button
                      className="element-button remove-button"
                      onClick={() => handleElementRemove(element.id)}
                    >
                      Удалить
                    </button>
                  ) : (
                    <button
                      className="element-button add-button"
                      onClick={() => handleElementAdd(element.id)}
                    >
                      Добавить
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElementPanel;