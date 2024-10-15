import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserList from "./UserList.jsx";
import UserForm from "./UserForm.jsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*<App />*/}
    {/*  <UserList/>*/}
    {/*  <UserForm/>*/}
    {/*  <UserList />*/}
      <BrowserRouter>
        <App/>
      </BrowserRouter>
  </StrictMode>,
)
