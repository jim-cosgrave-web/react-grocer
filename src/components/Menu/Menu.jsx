import React, { useState, useEffect } from 'react';
import './Menu.scss'; 

import {
    BrowserRouter as Router,
    Link,
    useParams
  } from "react-router-dom";
 
function Menu() {
    let { id } = useParams();
    const [link, setLink] = useState('');

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
                <li onClick={() => setActive('admin')} className={link.indexOf('admin') > -1 ? 'active' : ''}>
                    <Link to="/admin">Admin</Link>
                </li>
            </ul> 
        </header>
    );
}

export default Menu;