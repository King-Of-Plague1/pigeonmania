import React, { useState, useEffect } from 'react';
import './App.css';
import PigeonCanvas from '../PigeonCanvas/PigeonCanvas';
import BodySelector from '../BodySelector/BodySelector';
import SegmentPanel from '../SegmentPanel/SegmentPanel';
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
    
    // Устанавливаем первый сегмент как активный по умолчанию
    const firstBody = Object.values(spritesConfig.baseBodies)[0];
    if (firstBody && firstBody.segments) {
      const firstSegment = Object.keys(firstBody.segments)[0];
      setActiveSegmentId(firstSegment);
    }
  }, []);

  const handleBodySelect = (bodyId) => {
    setConfiguration(prev => ({
      ...prev,
      baseBodyId: bodyId,
      // Сбрасываем элементы при смене базового тела
      elements: []
    }));
    
    // Сбрасываем активный сегмент при смене базового тела
    const newBody = baseBodies[bodyId];
    if (newBody && newBody.segments) {
      const firstSegment = Object.keys(newBody.segments)[0];
      setActiveSegmentId(firstSegment);
    } else {
      setActiveSegmentId(null);
    }
  };

  const handleSegmentSelect = (segmentId) => {
    setActiveSegmentId(segmentId);
  };

  const getCurrentBaseBody = () => {
    return baseBodies[configuration.baseBodyId];
  };

  const getCurrentSegments = () => {
    const baseBody = getCurrentBaseBody();
    return baseBody ? baseBody.segments : {};
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