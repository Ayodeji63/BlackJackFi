import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './components/App/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from "./utils/common/AuthProvider";
// Frontend/src/utils/common/AuthProvider.tsx

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>
 <AuthProvider>
 <Router>
    <App />
  </Router>
  </AuthProvider>
  //</React.StrictMode>
);
