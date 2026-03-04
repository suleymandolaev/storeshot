import { useState } from 'react';
import Sidebar from './components/Sidebar';
import CanvasPreview from './components/CanvasPreview';
import './App.css';

function App() {
  const [config, setConfig] = useState({
    backgroundColor: '#0f172a',
    backgroundColor2: '#3b0764',
    appImage: '',
    fontFamily: "'Inter', sans-serif",
    deviceType: 'iphone-65',
    backgroundPattern: 'none'
  });

  const [elements, setElements] = useState([
    {
      id: '1',
      type: 'badge',
      text: 'Joi Planner',
      color: '#d1d5db',
      backgroundColor: 'rgba(0,0,0,0)',
      fontSize: 24,
      fontWeight: 600,
      x: 32, // Optional default coordinates when testing layout natively
      y: 60,
    },
    {
      id: '2',
      type: 'heading',
      text: 'Visual daily\nAI planner',
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0)',
      fontSize: 48,
      fontWeight: 800,
      x: 32,
      y: 110,
    }
  ]);

  return (
    <div className="app-container">
      <Sidebar config={config} setConfig={setConfig} elements={elements} setElements={setElements} />
      <CanvasPreview config={config} setConfig={setConfig} elements={elements} setElements={setElements} />
    </div>
  );
}

export default App;
