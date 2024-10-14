import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserList from "./UserList.jsx";
import UserForm from "./UserForm.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*<App />*/}
    {/*  <UserList/>*/}
      <UserForm/>
      <UserList />
  </StrictMode>,
)
