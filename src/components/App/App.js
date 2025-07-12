import React, { useState, useEffect } from 'react';
import PigeonCanvas from '../PigeonCanvas/PigeonCanvas';
import BodySelector from '../BodySelector/BodySelector';
import SegmentPanel from '../SegmentPanel/SegmentPanel';
import ElementPanel from '../ElementPanel/ElementPanel';
import ColorManager from '../ColorManager/ColorManager';
import spritesConfig from '../../config/sprites.json';
import './App.css';


function App() {
  const [selectedBodyId, setSelectedBodyId] = useState(null);
  const [activeSegmentId, setActiveSegmentId] = useState(null);
  const [elements, setElements] = useState([]);
  const [baseBodyColor, setBaseBodyColor] = useState(null);

  // Инициализация с первым доступным телом
  useEffect(() => {
    const firstBodyId = Object.keys(spritesConfig.baseBodies)[0];
    if (firstBodyId) {
      setSelectedBodyId(firstBodyId);
    }
  }, []);

  const currentBody = selectedBodyId ? spritesConfig.baseBodies[selectedBodyId] : null;
  const availableSegments = currentBody?.segments || {};

  const handleBodySelect = (bodyId) => {
    setSelectedBodyId(bodyId);
    setActiveSegmentId(null);
    setElements([]);
    setBaseBodyColor(null);
  };

  const handleSegmentSelect = (segmentId) => {
    setActiveSegmentId(segmentId);
  };

  const handleElementAdd = (elementId) => {
    if (!activeSegmentId || !currentBody) return;

    const decorativeElement = spritesConfig.decorativeElements[elementId];
    if (!decorativeElement) return;

    const segment = currentBody.segments[activeSegmentId];
    if (!segment) return;

    // Проверяем, что элемент этого типа еще не добавлен
    const elementExists = elements.some(el => el.spriteId === elementId);
    if (elementExists) return;

    const newElement = {
      id: `${elementId}-${Date.now()}`,
      segmentId: activeSegmentId,
      spriteId: elementId,
      name: decorativeElement.name,
      sprite: decorativeElement.sprite,
      position: segment.attachmentPoint,
      color: null
    };

    setElements(prev => [...prev, newElement]);
  };

  const handleElementRemove = (elementId) => {
    setElements(prev => prev.filter(el => el.spriteId !== elementId));
  };

  const handleBaseBodyColorChange = (color) => {
    setBaseBodyColor(color);
  };

  const handleElementColorChange = (elementId, color) => {
    setElements(prev => prev.map(element => 
      element.id === elementId 
        ? { ...element, color }
        : element
    ));
  };

  const getBaseBodyWithColor = () => {
    if (!currentBody) return null;
    
    return {
      ...currentBody,
      color: baseBodyColor
    };
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>🐦 Конструктор голубей</h1>
        <p>Создайте уникального голубя с помощью декоративных элементов и цветов</p>
      </div>
      
      <div className="app-content">
        <div className="controls-panel">
          <BodySelector
            baseBodies={spritesConfig.baseBodies}
            selectedBodyId={selectedBodyId}
            onBodySelect={handleBodySelect}
          />
          
          <SegmentPanel
            segments={availableSegments}
            activeSegmentId={activeSegmentId}
            onSegmentSelect={handleSegmentSelect}
          />
          
          <ElementPanel
            decorativeElements={spritesConfig.decorativeElements}
            activeSegmentId={activeSegmentId}
            onElementAdd={handleElementAdd}
            onElementRemove={handleElementRemove}
            currentElements={elements}
          />
        </div>
        
        <div className="canvas-panel">
          <PigeonCanvas
            baseBody={getBaseBodyWithColor()}
            elements={elements}
            activeSegmentId={activeSegmentId}
          />
          
          <ColorManager
            baseBody={getBaseBodyWithColor()}
            activeSegmentId={activeSegmentId}
            currentElements={elements}
            onBaseBodyColorChange={handleBaseBodyColorChange}
            onElementColorChange={handleElementColorChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;