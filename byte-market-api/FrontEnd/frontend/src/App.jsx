import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TheRoutes from "./Routes.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <TheRoutes/>
    </>
  )
}

export default App
