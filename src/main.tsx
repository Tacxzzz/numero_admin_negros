import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
    domain="dev-mxx27ro7oiyfix2j.jp.auth0.com"
    clientId="tqNqjxKCeoRDdFTfb7ZcgwDMNP8pOQJ0"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    cacheLocation="localstorage"
  > 
    <App />
    </Auth0Provider>
    
  </React.StrictMode>
)