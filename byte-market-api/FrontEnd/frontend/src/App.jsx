import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import logo from './assets/WizCat.jpg'
import profileIcon from './assets/profileIcon.png'
import arrow from './assets/Arrow.png'
import searchIcon from './assets/searchIcon.png'
import TheRoutes from "./Routes.jsx";

function App() {
    return (
        <>
            <div className="container1">
                <header className="header">
                    <div className="logoAndName">
                        <img src={logo} alt="ByteMarket Logo" className="logo"/>
                        <h1>ByteMarket</h1>
                    </div>
                    <div className="profileBar">
                        <img src={arrow} alt="Arrow" className="profileArrow"/>
                        <img src={profileIcon} alt="Profile Icon" className="profileIcon"/>
                    </div>
                </header>
            </div>
            <div className="container2">
                <div className="searchBar">
                    <input type="text" placeholder="Search..." className="searchBar"/>
                    <button className="searchButton"><img src={searchIcon} alt="Search Icon" className="searchIcon"/></button>
                </div>
            </div>
            <div className="container3">
                <body>
                <h1>This is where you put all your contents, all pages must have the same format,
                    Unless on special pages that we might encounter later</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                <h1>WAW</h1>
                </body>
            </div>
        </>
    );
}

export default App
