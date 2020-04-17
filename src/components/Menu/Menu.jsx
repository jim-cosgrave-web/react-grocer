import React, { useState, useEffect } from 'react';
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
    const [shopLink, setShopLink] = useState(null);

    useEffect(() => {
        const path = window.location.pathname.replace('/', '');
        getListData();

        switch (path) {
            case '':
            case 'shop':
                setLink('list');
                break;
            case 'store':
                setLink('store');
                break;
            case 'store':
                setLink('admin');
                break;
        }
    }, []);

    function setActive(clickedLink) {
        setLink(clickedLink)
    }

    const getListData = () => {
        axios.get(env.apiPrefix + 'list')
            .then(res => {
                const l = res.data[0];

                setShopLink('/shop/' + l._id);
            });
    }

    return (
        <header>
            <ul>
                <li onClick={() => setActive('list')} className={link === 'list' ? 'active' : ''}>
                    <Link to="/">List</Link>
                </li>
                {shopLink && <li onClick={() => setActive('store')} className={link.indexOf('store') > -1 ? 'active' : ''}>
                    <Link to={shopLink}>Store</Link>
                </li>}
                <li onClick={() => setActive('admin')} className={link === 'admin' ? 'active' : ''}>
                    <Link to="/admin">Admin</Link>
                </li>
            </ul>
        </header>
    );
}

export default Menu;