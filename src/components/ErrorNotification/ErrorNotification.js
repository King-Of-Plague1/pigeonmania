import React from 'react';
import './ErrorNotification.css';

const ErrorNotification = ({ 
  error, 
  onClose 
}) => {
  if (!error) return null;

  const getErrorIcon = (type) => {
    switch (type) {
      case 'validation':
        return '⚠️';
      case 'parse':
        return '📄';
      case 'unknown':
        return '❌';
      default:
        return '❌';
    }
  };

  const getErrorTitle = (type) => {
    switch (type) {
      case 'validation':
        return 'Ошибка валидации';
      case 'parse':
        return 'Ошибка чтения файла';
      case 'unknown':
        return 'Неизвестная ошибка';
      default:
        return 'Ошибка';
    }
  };

  return (
    <div className="error-notification">
      <div className="error-overlay" onClick={onClose} />
      <div className="error-content">
        <div className="error-header">
          <span className="error-icon">{getErrorIcon(error.type)}</span>
          <h4 className="error-title">{getErrorTitle(error.type)}</h4>
          <button className="error-close" onClick={onClose}>×</button>
        </div>
        
        <div className="error-body">
          <p className="error-message">{error.message}</p>
          
          {error.details && error.details.length > 0 && (
            <div className="error-details">
              <strong>Подробности:</strong>
              <ul>
                {error.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="error-footer">
          <button className="error-ok-button" onClick={onClose}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;