import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add this line to import the font
import '@fontsource/poppins'; // If you're using Poppins
// OR you can keep using the import in CSS:

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 