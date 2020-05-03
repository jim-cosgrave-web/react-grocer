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
    const [hideGroceries, setHideGroceries] = useState(false);
    const [refreshBlock, setRefreshBlock] = useState(false);
    const groceryInputRef = React.createRef();

    useEffect(() => {
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
        if (event.key == 'Enter') {
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

    const handleHideClick = () => {
        const hidden = !hideGroceries;

        let clone = { ...list };

        for (let i = 0; i < clone.groceries.length; i++) {
            let grocery = clone.groceries[i];

            if (grocery.checked && hidden) {
                grocery.hidden = true;
            } else {
                grocery.hidden = false;
            }
        }

        setHideGroceries(hidden);
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

    const handleGroceryKeyPress = () => {
        setRefreshBlock(true);
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
            <div className="list-btn-container">
                <div className="g-btn g-btn-large btn-hide btn-warning noselect" onClick={handleHideClick}>{hideGroceries ? 'Show' : 'Hide'} Groceries</div>
                <div className="g-btn g-btn-large btn-clear btn-danger noselect" onClick={handleClearClick}>Clear Groceries</div>
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
                    return !g.hidden && <Grocery onClick={handleGroceryClick} grocery={g} key={g.name + '_' + g.checked} update={updateGrocery} onKeyPress={handleGroceryKeyPress}></Grocery>
                })}
            </div>
        </div>
    );

    return content;
}

export default GroceryList;