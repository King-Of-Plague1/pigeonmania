import React from 'react';
import './OpacityPicker.css';

const OpacityPicker = ({
  selectedOpacity,
  onOpacityChange,
  onOpacityReset,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="opacity-picker">
      <h3>Прозрачность</h3>
      <div className="opacity-slider-container">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={Math.round((selectedOpacity ?? 1) * 100)}
          onChange={(e) => onOpacityChange(parseInt(e.target.value, 10) / 100)}
        />
        <span>{Math.round((selectedOpacity ?? 1) * 100)}%</span>
      </div>
      <button
        className="reset-button"
        onClick={onOpacityReset}
        disabled={selectedOpacity === null || selectedOpacity === 1}
      >
        Сбросить прозрачность
      </button>
    </div>
  );
};

export default OpacityPicker;
