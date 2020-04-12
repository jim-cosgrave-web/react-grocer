import React, { useState, useEffect } from 'react';
import GrocerySearch from './GrocerySearch/GrocerySearch';
import Grocery from './Grocery/Grocery';
import GroceryGroup from './GroceryGroup/GroceryGroup';

import axios from 'axios';
import env from '../Shared/Environment';

const GroceryList = (props) => {
    const [list, setList] = useState(null);


    useEffect(() => {
        axios.get(env.apiPrefix + 'list')
            .then(res => {
                const l = res.data[0];

                if (l.groceries) {
                    l.groceries.sort(compareNames);
                }

                setList(l);
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
        <div className="grocery-list">
            <GrocerySearch onChange={changeHandler}></GrocerySearch>
            <div className="list">
                {list && list.groceries && list.groceries.map((g, index) => {
                    return <Grocery grocery={g} key={index} update={updateGrocery}></Grocery>
                })}
            </div>
        </div>
    );

    return content;
}

export default GroceryList;