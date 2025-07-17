import React, { useState, useEffect } from 'react';
import PigeonCanvas from '../PigeonCanvas/PigeonCanvas';
import BodySelector from '../BodySelector/BodySelector';
import SegmentPanel from '../SegmentPanel/SegmentPanel';
import ElementPanel from '../ElementPanel/ElementPanel';
import ColorManager from '../ColorManager/ColorManager';
import ImportExport from '../ImportExport/ImportExport';
import ErrorNotification from '../ErrorNotification/ErrorNotification';
import spritesConfig from '../../config/sprites.json';
import './App.css';

function App() {
  const [selectedBodyId, setSelectedBodyId] = useState(null);
  const [activeSegmentId, setActiveSegmentId] = useState(null);
  const [elements, setElements] = useState([]);
  const [baseBodyColor, setBaseBodyColor] = useState(null);
  const [baseBodyBrightness, setBaseBodyBrightness] = useState(1.0);
  const [importError, setImportError] = useState(null);

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
    setBaseBodyBrightness(1.0);
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
      color: null,
      opacity: 1.0,
      brightness: 1.0
    };

    setElements(prev => [...prev, newElement]);
  };

  const handleElementRemove = (elementId) => {
    setElements(prev => prev.filter(el => el.spriteId !== elementId));
  };

  const handleBaseBodyColorChange = (color) => {
    setBaseBodyColor(color);
  };

  const handleBaseBodyBrightnessChange = (brightness) => {
    setBaseBodyBrightness(brightness);
  };

  const handleElementColorChange = (elementId, color) => {
    setElements(prev => prev.map(element => 
      element.id === elementId 
        ? { ...element, color }
        : element
    ));
  };

  const handleElementOpacityChange = (elementId, opacity) => {
  setElements(prev => prev.map(element =>
    element.id === elementId
      ? { ...element, opacity }
      : element
    ));
  };

  const handleElementBrightnessChange = (elementId, brightness) => {
  setElements(prev => prev.map(element =>
    element.id === elementId
      ? { ...element, brightness }
      : element
    ));
  };

  const handleConfigurationImport = (config) => {
    try {
      // Проверяем, что базовое тело существует
      if (!spritesConfig.baseBodies[config.baseBodyId]) {
        setImportError({
          type: 'validation',
          message: 'Базовое тело не найдено',
          details: [`Базовое тело с ID "${config.baseBodyId}" не существует в текущей конфигурации`]
        });
        return;
      }

      // Проверяем элементы
      const validElements = [];
      const invalidElements = [];

      config.elements.forEach(element => {
        const decorativeElement = spritesConfig.decorativeElements[element.spriteId];
        const body = spritesConfig.baseBodies[config.baseBodyId];
        const segment = body?.segments[element.segmentId];

        if (!decorativeElement) {
          invalidElements.push(`Декоративный элемент "${element.spriteId}" не найден`);
          return;
        }

        if (!segment) {
          invalidElements.push(`Сегмент "${element.segmentId}" не найден для базового тела`);
          return;
        }

        validElements.push({
          ...element,
          name: decorativeElement.name,
          sprite: decorativeElement.sprite
        });
      });

      if (invalidElements.length > 0) {
        setImportError({
          type: 'validation',
          message: 'Некоторые элементы конфигурации недоступны',
          details: invalidElements
        });
        return;
      }

      // Применяем конфигурацию
      setSelectedBodyId(config.baseBodyId);
      setElements(validElements);
      setBaseBodyColor(config.baseBodyColor || null);
      setActiveSegmentId(null);

    } catch (error) {
      setImportError({
        type: 'unknown',
        message: 'Ошибка применения конфигурации',
        details: [error.message]
      });
    }
  };

  const handleImportError = (error) => {
    setImportError(error);
  };

  const handleErrorClose = () => {
    setImportError(null);
  };

  const getBaseBodyWithStyle = () => {
    if (!currentBody) return null;
    
    return {
      ...currentBody,
      color: baseBodyColor,
      brightness: baseBodyBrightness
    };
  };

  const getCurrentConfiguration = () => {
    return {
      baseBodyId: selectedBodyId,
      elements,
      baseBodyColor
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

          <ImportExport
            currentConfiguration={getCurrentConfiguration()}
            onConfigurationImport={handleConfigurationImport}
            onImportError={handleImportError}
          />
        </div>
        
        <div className="canvas-panel">
          <PigeonCanvas
            baseBody={getBaseBodyWithStyle()}
            elements={elements}
            activeSegmentId={activeSegmentId}
          />
          
          <ColorManager
            baseBody={getBaseBodyWithStyle()}
            activeSegmentId={activeSegmentId}
            currentElements={elements}
            onBaseBodyColorChange={handleBaseBodyColorChange}
            onBaseBodyBrightnessChange={handleBaseBodyBrightnessChange}
            onElementColorChange={handleElementColorChange}
            onElementOpacityChange={handleElementOpacityChange}
            onElementBrightnessChange={handleElementBrightnessChange}
          />
        </div>
      </div>

      <ErrorNotification
        error={importError}
        onClose={handleErrorClose}
      />
    </div>
  );
}

export default App;