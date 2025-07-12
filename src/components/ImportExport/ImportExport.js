import React, { useRef, useState } from 'react';
import './ImportExport.css';

const ImportExport = ({
  currentConfiguration,
  onConfigurationImport,
  onImportError
}) => {
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = () => {
    const config = {
      baseBodyId: currentConfiguration.baseBodyId,
      elements: currentConfiguration.elements.map(element => ({
        id: element.id,
        segmentId: element.segmentId,
        spriteId: element.spriteId,
        color: element.color,
        position: element.position
      })),
      baseBodyColor: currentConfiguration.baseBodyColor,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pigeon-config-${new Date().toISOString().slice(0, 10)}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const validateConfiguration = (config) => {
    const errors = [];

    if (!config || typeof config !== 'object') {
      errors.push('Файл не содержит валидного JSON объекта');
      return errors;
    }

    if (!config.baseBodyId || typeof config.baseBodyId !== 'string') {
      errors.push('Отсутствует или неверный baseBodyId');
    }

    if (!Array.isArray(config.elements)) {
      errors.push('Отсутствует или неверный массив elements');
    } else {
      config.elements.forEach((element, index) => {
        if (!element.id || typeof element.id !== 'string') {
          errors.push(`Элемент ${index}: отсутствует или неверный id`);
        }
        if (!element.segmentId || typeof element.segmentId !== 'string') {
          errors.push(`Элемент ${index}: отсутствует или неверный segmentId`);
        }
        if (!element.spriteId || typeof element.spriteId !== 'string') {
          errors.push(`Элемент ${index}: отсутствует или неверный spriteId`);
        }
        if (element.position && typeof element.position === 'object') {
          if (typeof element.position.x !== 'number' || typeof element.position.y !== 'number') {
            errors.push(`Элемент ${index}: неверные координаты position`);
          }
        } else {
          errors.push(`Элемент ${index}: отсутствует или неверный position`);
        }
      });
    }

    return errors;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      const text = await file.text();
      const config = JSON.parse(text);
      
      const validationErrors = validateConfiguration(config);
      
      if (validationErrors.length > 0) {
        onImportError({
          type: 'validation',
          message: 'Ошибки валидации конфигурации',
          details: validationErrors
        });
        return;
      }

      onConfigurationImport(config);
      
    } catch (error) {
      if (error instanceof SyntaxError) {
        onImportError({
          type: 'parse',
          message: 'Ошибка парсинга JSON файла',
          details: [error.message]
        });
      } else {
        onImportError({
          type: 'unknown',
          message: 'Неизвестная ошибка при импорте',
          details: [error.message]
        });
      }
    } finally {
      setIsProcessing(false);
      // Сбрасываем значение input для возможности повторного выбора того же файла
      event.target.value = '';
    }
  };

  const getCurrentConfigInfo = () => {
    const info = [];
    
    if (currentConfiguration.baseBodyId) {
      info.push(`Базовое тело: ${currentConfiguration.baseBodyId}`);
    }
    
    info.push(`Элементов: ${currentConfiguration.elements.length}`);
    
    const coloredElements = currentConfiguration.elements.filter(el => el.color).length;
    if (coloredElements > 0) {
      info.push(`Окрашенных элементов: ${coloredElements}`);
    }
    
    if (currentConfiguration.baseBodyColor) {
      info.push(`Цвет тела: ${currentConfiguration.baseBodyColor}°`);
    }
    
    return info;
  };

  return (
    <div className="import-export">
      <h3>Сохранение и загрузка</h3>
      
      <div className="config-info">
        <div className="config-summary">
          <strong>Текущая конфигурация:</strong>
          <ul>
            {getCurrentConfigInfo().map((info, index) => (
              <li key={index}>{info}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="export-button"
          onClick={handleExport}
          disabled={!currentConfiguration.baseBodyId}
        >
          📥 Экспорт в JSON
        </button>
        
        <button
          className="import-button"
          onClick={handleImportClick}
          disabled={isProcessing}
        >
          {isProcessing ? '⏳ Загрузка...' : '📤 Импорт из JSON'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <div className="format-info">
        <details>
          <summary>ℹ️ Формат файла</summary>
          <div className="format-details">
            <p>JSON файл должен содержать:</p>
            <ul>
              <li><strong>baseBodyId</strong> - ID базового тела</li>
              <li><strong>elements</strong> - массив декоративных элементов</li>
              <li><strong>baseBodyColor</strong> - цвет базового тела (опционально)</li>
            </ul>
            <p>Каждый элемент содержит: id, segmentId, spriteId, color, position</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ImportExport;