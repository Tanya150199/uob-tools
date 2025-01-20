import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM from the new API in React 18
import App from './App'; // Ensure this path matches your App.js file
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

