import React, { useState, useEffect } from 'react';
import GrocerySearch from './GrocerySearch/GrocerySearch';
import Grocery from './Grocery/Grocery';
import GroceryGroup from './GroceryGroup/GroceryGroup';

const GroceryList = (props) => {
    const [groceries, setGroceries] = useState([]);

    const getGroceries = () => {
        let groceries = [
          {
              groupName: 'Vegetables',
              groceries: [
                {
                    id: 1,
                    name: 'Apples',
                    checked: false
                },
                {
                  id: 2,
                  name: 'Tomatoes',
                  checked: false
                },
                {
                  id: 3,
                  name: 'Milk',
                  checked: true
                }
              ]
          }
        ];

        return groceries;
    }

    useEffect(() => {
        setGroceries(getGroceries());
    }, []);

    const changeHandler = (value) => {
        console.log('GroceryList.jsx', value);
    }

    let content = (
        <div className="grocery-list">
            <GrocerySearch onChange={changeHandler}></GrocerySearch>
            <div className="list">
                {groceries.map((g, index) => {
                    return <GroceryGroup key={index} group={g}></GroceryGroup>
                })}
            </div>
        </div>
    );

    return content;
}

export default GroceryList;