import React from 'react';
import './App.css';
import PigeonCanvas from '../PigeonCanvas/PigeonCanvas';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Конструктор голубей</h1>
        <p>Создайте своего уникального голубя</p>
      </header>
      
      <main className="app-main">
        <div className="canvas-section">
          <PigeonCanvas />
        </div>
        
        <div className="controls-section">
          <div className="controls-placeholder">
            <p>Панель управления будет добавлена в следующих шагах</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;