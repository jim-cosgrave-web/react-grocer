import React, { useState, useEffect } from 'react';
import GrocerySearch from './GrocerySearch/GrocerySearch';
import MyTypeahead from './../Shared/Typeahead/Typeahead';
import Grocery from './Grocery/Grocery';
import Meals from './Meals';
import { useInterval } from '../../hooks/useInterval';

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
    const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
    const groceryInputRef = React.createRef();

    useEffect(() => {
        getListData();
    }, []);

    useInterval(() => {
        if (!refreshBlock) {
            console.log('Refreshing data');
            setLastRefreshTime(new Date());
            getListData();
        } else {
            console.log('Refresh blocked due to interaction with grocery');
            setRefreshBlock(false);
        }

    }, 30000);

    const getListData = () => {
        axios.get(env.apiPrefix + 'list')
            .then(res => {
                const l = res.data[0];

                if (l) {
                    if (l.groceries) {
                        l.groceries.sort(compareNames);
                    }

                    setList(l);
                    setShopUrl('/shop/' + l._id);
                }
            });
    }

    const handleInputKeyUp = (event) => {
        if (event.key == 'Enter') {
            handleAddGrocery();
        }
    }

    const handleAddGrocery = (value) => {
        handleGroceryInteraction();

        //let value = groceryInputRef.current.value;

        const body = {
            "list_id": list._id,
            "grocery": {
                "name": value
            }
        };

        const grocery = list.groceries.find(g => g.name == value);

        if (!grocery) {
            axios.post(env.apiPrefix + 'list/grocery', body).then(res => {
                if (!res.data.exists) {
                    setList(res.data);
                }
            });
        }

        //groceryInputRef.current.value = '';
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
        handleGroceryInteraction();

        const body = { list_id: list._id, grocery: grocery };
        axios.put(env.apiPrefix + 'list/grocery', body);
    }

    const handleGroceryClick = (grocery) => {
        const body = { list_id: list._id, grocery: grocery };
        axios.put(env.apiPrefix + 'list/grocery', body);

        let clone = { ...list };
        const index = clone.groceries.map(e => e.name).indexOf(grocery.name);
        clone.groceries[index] = grocery;
        setList(clone);
    }

    const handleHideClick = () => {
        handleGroceryInteraction();

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
        handleGroceryInteraction();

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

    const handleGroceryInteraction = () => {
        setRefreshBlock(true);
    }

    const formatDateTime = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    }

    const handleGrocerySearchAdd = (grocery) => {
        console.log(grocery);
    }

    let content = (
        <div className="grocery-list" style={{ maxWidth: "600px" }}>
            <h2>Grocery List</h2>
            <Meals></Meals>
            <div style={{ marginTop: "16px" }}>
                <div>
                    <MyTypeahead placeholder="Add a grocery" type="groceries" onAdd={handleAddGrocery}></MyTypeahead>
                </div>
            </div>
            <div className="list-btn-container">
                <div className="g-btn g-btn-large btn-hide btn-warning noselect" onClick={handleHideClick}>{hideGroceries ? 'Show' : 'Hide'} Groceries</div>
                <div className="g-btn g-btn-large btn-clear btn-danger noselect" onClick={handleClearClick}>Clear Groceries</div>
            </div>
            <div style={{ marginTop: "16px", textAlign: "right" }}>
                Last refresh at {formatDateTime(lastRefreshTime)}
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
                    return !g.hidden &&
                        <Grocery onClick={handleGroceryClick}
                            grocery={g}
                            key={g.name + '_' + g.checked}
                            update={updateGrocery}
                            onInteraction={handleGroceryInteraction}>
                        </Grocery>
                })}
            </div>
        </div>
    );

    return content;
}

export default GroceryList;