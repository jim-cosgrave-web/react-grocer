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
    const groceryInputRef = React.createRef();

    useEffect(() => {
        //console.log(process.env);

        getListData();

        const interval = setInterval(() => {
            getListData();
        }, 10000);

        return function () {
            clearTimeout(interval);
        }
    }, []);

    const getListData = () => {
        axios.get(env.apiPrefix + 'list')
            .then(res => {
                const l = res.data[0];

                if (l.groceries) {
                    l.groceries.sort(compareNames);
                }

                setList(l);
                setShopUrl('/shop/' + l._id);
            });
    }

    const handleInputKeyUp = (event) => {
        if(event.key == 'Enter') {
            handleAddGrocery();
        }
    }

    const handleAddGrocery = () => {
        let value = groceryInputRef.current.value;

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

        groceryInputRef.current.value = '';
        groceryInputRef.current.focus();
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

    const handleGroceryClick = (grocery) => {
        const body = { list_id: list._id, grocery: grocery };
        axios.put(env.apiPrefix + 'list/grocery', body);
    }

    const handleClearClick = () => {
        let indices = [];
        let clone = { ...list };

        for (let i = 0; i < clone.groceries.length; i++) {
            if (clone.groceries[i].checked) {
                indices.push(i);
            }
        }

        if (indices.length > 0) {
            for (let i = indices.length - 1; i >= 0; i--) {
                clone.groceries.splice(indices[i], 1);
            }

            setList(clone);

            const body = { list_id: clone._id };
            axios.post(env.apiPrefix + 'list/removechecked', body);
        }
    }

    let content = (
        <div className="grocery-list" style={{ maxWidth: "600px" }}>
            <div style={{ marginTop: "16px" }}>
                {/* <GrocerySearch onChange={handleAddGrocery}></GrocerySearch> */}
                <div className="grocery-search">
                    <div>
                        <input type="text" ref={groceryInputRef} onKeyUp={handleInputKeyUp}></input>
                    </div>
                    <div className="g-btn search-add-btn" onClick={handleAddGrocery}>Add</div>
                </div>
            </div>
            <div style={{ marginTop: "16px" }}>
                <div className="g-btn" onClick={handleClearClick}>Clear Crossed-Off Groceries</div>
            </div>
            <div style={{ marginTop: "16px" }} className="list-category-name">
                <div>
                    Grocery List
                </div>
                <div className="item-count">
                    {list && list.groceries.length} items
                </div>
            </div>
            <div className="list">
                {list && list.groceries && list.groceries.map((g, index) => {
                    return <Grocery onClick={handleGroceryClick} grocery={g} key={g.name + '_' + g.checked} update={updateGrocery}></Grocery>
                })}
            </div>
        </div>
    );

    return content;
}

export default GroceryList;