import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import './Menu.scss';

import axios from 'axios';
import env from '../Shared/Environment';

import {
    BrowserRouter as Router,
    Link,
    useParams
} from "react-router-dom";

function Menu() {
    let { id } = useParams();
    const [link, setLink] = useState('');
    const [shopLink, setShopLink] = useState('/list');
    const [render, setRender] = useState(localStorage.getItem("token") ? true : false);
    const history = useHistory();

    useEffect(() => {
        getListData();

        let path = window.location.pathname.replace('/', '');

        if(path.indexOf('/') != -1) {
            path = path.substring(0, path.indexOf('/'));
        }

        switch (path) {
            case '':
            case 'list':
                setLink('list');
                break;
            case 'shop':
                setLink('store');
                break;
            case 'store':
                setLink('admin');
                break;
        }

        checkAuthentication();
    }, []);

    const checkAuthentication = () => {
        setInterval(() => {
            const tokenExists = localStorage.getItem("token");

            if(tokenExists == null) {
                setRender(false);

                if(window.location.pathname != '/') {
                    history.push('/');
                }
            } else {
                setRender(true);
            }
        }, 1000);
    }

    function setActive(clickedLink) {
        setLink(clickedLink)
    }

    const getListData = () => {
        const interval = setInterval(() => {
            const token = localStorage.getItem('token');

            if(token) {
                axios.get(env.apiPrefix + 'list')
                .then(res => {
                    const l = res.data[0];
    
                    setShopLink('/shop/' + l._id);
                });

                clearInterval(interval);
            }
        }, 1000);

    }

    return (
        <header>
            {render &&
                <ul>
                    <li onClick={() => setActive('list')} className={link === 'list' ? 'active' : ''}>
                        <Link to="/list">List</Link>
                    </li>
                    {shopLink && <li onClick={() => setActive('store')} className={link.indexOf('store') > -1 ? 'active' : ''}>
                        <Link to={shopLink}>Store</Link>
                    </li>}
                    <li onClick={() => setActive('admin')} className={link === 'admin' ? 'active' : ''}>
                        <Link to="/admin">Admin</Link>
                    </li>
                </ul>}
        </header>
    );
}

export default Menu;