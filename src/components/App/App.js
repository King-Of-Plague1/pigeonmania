import React, { useState, useEffect } from 'react';
import './App.css';
import PigeonCanvas from '../PigeonCanvas/PigeonCanvas';
import BodySelector from '../BodySelector/BodySelector';
import SegmentPanel from '../SegmentPanel/SegmentPanel';
import ElementPanel from '../ElementPanel/ElementPanel';
import spritesConfig from '../../config/sprites.json';

function App() {
  const [configuration, setConfiguration] = useState({
    baseBodyId: 'body1',
    elements: []
  });
  
  const [baseBodies, setBaseBodies] = useState({});
  const [decorativeElements, setDecorativeElements] = useState({});
  const [activeSegmentId, setActiveSegmentId] = useState(null);

  useEffect(() => {
    // Загружаем конфигурацию спрайтов
    setBaseBodies(spritesConfig.baseBodies);
    setDecorativeElements(spritesConfig.decorativeElements);
  }, []);

  const handleBodySelect = (bodyId) => {
    setConfiguration(prev => ({
      ...prev,
      baseBodyId: bodyId,
      // Сбрасываем элементы при смене базового тела
      elements: []
    }));
    // Сбрасываем активный сегмент
    setActiveSegmentId(null);
  };

  const handleSegmentSelect = (segmentId) => {
    setActiveSegmentId(segmentId);
  };

  const handleElementAdd = (elementId) => {
    if (!activeSegmentId) return;

    const decorativeElement = decorativeElements[elementId];
    if (!decorativeElement) return;

    const baseBody = getCurrentBaseBody();
    if (!baseBody || !baseBody.segments[activeSegmentId]) return;

    // Проверяем, нет ли уже этого элемента на сегменте
    const existingElement = configuration.elements.find(
      el => el.spriteId === elementId && el.segmentId === activeSegmentId
    );
    
    if (existingElement) return;

    const attachmentPoint = baseBody.segments[activeSegmentId].attachmentPoint;
    
    const newElement = {
      id: `${elementId}-${Date.now()}`,
      segmentId: activeSegmentId,
      spriteId: elementId,
      sprite: decorativeElement.sprite,
      name: decorativeElement.name,
      color: null,
      position: {
        x: attachmentPoint.x,
        y: attachmentPoint.y
      }
    };

    setConfiguration(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  };

  const handleElementRemove = (elementId) => {
    if (!activeSegmentId) return;

    setConfiguration(prev => ({
      ...prev,
      elements: prev.elements.filter(
        element => !(element.spriteId === elementId && element.segmentId === activeSegmentId)
      )
    }));
  };

  const getCurrentBaseBody = () => {
    return baseBodies[configuration.baseBodyId];
  };

  const getCurrentSegments = () => {
    const baseBody = getCurrentBaseBody();
    return baseBody ? baseBody.segments : {};
  };

  const getCurrentSegmentElements = () => {
    if (!activeSegmentId) return [];
    
    return configuration.elements.filter(
      element => element.segmentId === activeSegmentId
    );
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1>Конструктор голубей</h1>
      </div>
      
      <div className="app-content">
        <div className="controls-panel">
          <BodySelector
            baseBodies={baseBodies}
            selectedBodyId={configuration.baseBodyId}
            onBodySelect={handleBodySelect}
          />
          
          <SegmentPanel
            segments={getCurrentSegments()}
            activeSegmentId={activeSegmentId}
            onSegmentSelect={handleSegmentSelect}
          />
          
          <ElementPanel
            decorativeElements={decorativeElements}
            activeSegmentId={activeSegmentId}
            onElementAdd={handleElementAdd}
            onElementRemove={handleElementRemove}
            currentElements={getCurrentSegmentElements()}
          />
        </div>
        
        <div className="canvas-container">
          <PigeonCanvas
            baseBody={getCurrentBaseBody()}
            elements={configuration.elements}
            activeSegmentId={activeSegmentId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;