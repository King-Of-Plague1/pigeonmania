import React from 'react';
import './SegmentPanel.css';

const SegmentPanel = ({ 
  segments, 
  activeSegmentId, 
  onSegmentSelect 
}) => {
  const handleSegmentSelect = (segmentId) => {
    onSegmentSelect(segmentId);
  };

  if (!segments || Object.keys(segments).length === 0) {
    return (
      <div className="segment-panel">
        <h3>Выберите сегмент</h3>
        <div className="no-segments">
          Нет доступных сегментов
        </div>
      </div>
    );
  }

  return (
    <div className="segment-panel">
      <h3>Выберите сегмент</h3>
      <div className="segment-options">
        {Object.values(segments).map((segment) => (
          <div
            key={segment.id}
            className={`segment-option ${activeSegmentId === segment.id ? 'active' : ''}`}
            onClick={() => handleSegmentSelect(segment.id)}
          >
            <div className="segment-icon">
              {segment.icon || '📍'}
            </div>
            <span className="segment-name">{segment.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SegmentPanel;