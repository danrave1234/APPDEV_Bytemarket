import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
//Dont TOUCH unless Necessary
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
  </StrictMode>,
)
