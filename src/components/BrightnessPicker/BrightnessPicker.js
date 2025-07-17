import React from 'react';
import './BrightnessPicker.css';

const BrightnessPicker = ({
  selectedBrightness,
  onBrightnessChange,
  onBrightnessReset,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="brightness-picker">
      <h3>Яркость</h3>
      <div className="brightness-slider-container">
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.01"
          value={selectedBrightness ?? 1.0}
          onChange={(e) => onBrightnessChange(parseFloat(e.target.value))}
        />
        <span>{(selectedBrightness ?? 1.0).toFixed(2)}</span>
      </div>
      <button
        className="reset-button"
        onClick={onBrightnessReset}
        disabled={selectedBrightness === null || selectedBrightness === 1}
      >
        Сбросить яркость
      </button>
    </div>
  );
};

export default BrightnessPicker;
