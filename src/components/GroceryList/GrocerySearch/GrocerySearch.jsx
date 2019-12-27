import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AutoComplete from './../../Shared/AutoComplete/AutoComplete';

function GrocerySearch() {
    const [groceries, setGroceries] = useState([]);
    const [count, setCount] = useState(0);

    let items = [];

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        console.log('groceries updated...', groceries);
    }, [groceries]);

    function getData() {
        axios.get('http://localhost:2584/api/Grocery')
          .then(res => {
             const values = res.data.groceries;
             setGroceries(values);
          }).catch(res => {
            console.error(res); 
          });
    }

    return (
        <div className="grocery-search">
            <AutoComplete suggestions={groceries}></AutoComplete>
        </div>
    );
}

export default GrocerySearch;