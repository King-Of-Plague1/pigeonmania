import React, { useState, useEffect } from 'react';
import './App.css';
import PigeonCanvas from '../PigeonCanvas/PigeonCanvas';
import BodySelector from '../BodySelector/BodySelector';
import spritesConfig from '../../config/sprites.json';

function App() {
  const [configuration, setConfiguration] = useState({
    baseBodyId: 'body1',
    elements: []
  });
  
  const [baseBodies, setBaseBodies] = useState({});
  const [decorativeElements, setDecorativeElements] = useState({});

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
  };

  const getCurrentBaseBody = () => {
    return baseBodies[configuration.baseBodyId];
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
        </div>
        
        <div className="canvas-container">
          <PigeonCanvas
            baseBody={getCurrentBaseBody()}
            elements={configuration.elements}
          />
        </div>
      </div>
    </div>
  );
}

export default App;