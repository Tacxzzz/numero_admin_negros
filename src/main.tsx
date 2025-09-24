import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<React.StrictMode>
    <Auth0Provider
    domain="dev-7pgk7z0rr3bnugod.jp.auth0.com"
    clientId="re4D5Ev4fW5FSZCZrF8lDQxNWetQKA3K"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    cacheLocation="localstorage"
  > 
    <App />
    </Auth0Provider>
    
  //</React.StrictMode>
)