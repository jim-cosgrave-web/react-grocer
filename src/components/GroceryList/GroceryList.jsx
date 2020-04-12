import React, { useState, useEffect } from 'react';
import GrocerySearch from './GrocerySearch/GrocerySearch';
import Grocery from './Grocery/Grocery';

import axios from 'axios';
import env from '../Shared/Environment';

import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";

const GroceryList = (props) => {
    const [list, setList] = useState(null);
    const [shopUrl, setShopUrl] = useState('');

    useEffect(() => {
        axios.get(env.apiPrefix + 'list')
            .then(res => {
                const l = res.data[0];

                if (l.groceries) {
                    l.groceries.sort(compareNames);
                }

                setList(l);
                setShopUrl('/shop/' + l._id);
            });
    }, []);

    const changeHandler = (value) => {
        const body = {
            "list_id": list._id,
            "grocery": {
                "name": value
            }
        };

        const grocery = list.groceries.find(g => g.name == value);

        if (!grocery) {
            axios.post(env.apiPrefix + 'list/grocery', body).then(res => {
                setList(res.data);
            });
        }
    }

    const compareNames = (a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }

    const updateGrocery = (grocery) => {
        const body = { list_id: list._id, grocery: grocery };

        axios.put(env.apiPrefix + 'list/grocery', body);
    }

    let content = (
        <div className="grocery-list" style={{ maxWidth: "600px" }}>
            <div>
                {list && <Link className="g-btn" to={shopUrl}>Shop</Link>}
            </div>
            <div style={{ marginTop: "16px" }}>
                <GrocerySearch onChange={changeHandler}></GrocerySearch>
            </div>
            <div className="list" style={{ marginTop: "16px" }}>
                {list && list.groceries && list.groceries.map((g, index) => {
                    return <Grocery grocery={g} key={index} update={updateGrocery}></Grocery>
                })}
            </div>
            <GrocerySearch onChange={changeHandler}></GrocerySearch>
        </div>
    );

    return content;
}

export default GroceryList;