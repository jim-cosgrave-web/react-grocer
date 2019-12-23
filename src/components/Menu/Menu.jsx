import React, { useState, useEffect } from 'react';
import './Menu.scss'; 

import {
    BrowserRouter as Router,
    Link
  } from "react-router-dom";
 
function Menu() {
    const [link, setLink] = useState(0);

    useEffect(() => {
        const path = window.location.pathname.replace('/', '');

        switch(path) {
            case '':
                setLink('home');
                break;
            case 'admin': 
                setLink('admin');
                break;
        }
    }, []);

    function setActive(clickedLink) {
        setLink(clickedLink)
    }

    return (
        <header>
            <ul>
                <li onClick={() => setActive('home')} className={link === 'home' ? 'active' : ''}>
                    <Link to="/">Home</Link>
                </li>
                <li onClick={() => setActive('admin')} className={link === 'admin' ? 'active' : ''}>
                    <Link to="/admin">Admin</Link>
                </li>
            </ul> 
        </header>
    );
}

export default Menu;