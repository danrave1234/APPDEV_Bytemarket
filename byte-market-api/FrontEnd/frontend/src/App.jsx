import {Route, Routes} from "react-router-dom";
import {useEffect, useState} from 'react';
import TheRoutes from "./Routes.jsx";
import './styles/App.css';
import {AuthProvider} from "./components/AuthProvider.jsx";
import useScrollToTop from "./components/UseScrollOnTop.jsx";
//Dont TOUCH! unless Necessary
function App(){
    useScrollToTop();
    return (
        <>
                <TheRoutes/>
        </>
    )
}
export default App;