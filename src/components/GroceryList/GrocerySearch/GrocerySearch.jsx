import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AutoComplete from './../../Shared/AutoComplete/AutoComplete';
import { compare } from './../../../utils/compare';

const GrocerySearch = (props) => {
    const [groceries, setGroceries] = useState([]);
    const [count, setCount] = useState(0);

    let items = [];

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {

    }, [groceries]);

    const getData = () => {
        axios.get('http://localhost:2584/api/Grocery')
          .then(res => {
              if(res.data && res.data.groceris) {
             const values = res.data.groceries.sort(compare);
             setGroceries(values);
              } 
          }).catch(res => {
            console.error(res); 
          });
    } 

    const changeHandler = (value) => {
        props.onChange(value);
    }

    let content = (
        <div className="grocery-search">
            <AutoComplete onChange={changeHandler} suggestions={groceries}></AutoComplete>
        </div>
    );

    return content;
}

export default GrocerySearch;