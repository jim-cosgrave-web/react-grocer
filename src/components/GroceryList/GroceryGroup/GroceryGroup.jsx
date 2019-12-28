import React, { useState, useEffect } from 'react';
import Grocery from './../Grocery/Grocery';

const GroceryGroup = (props) => {
    console.log(props.group.groceries);
    let content = 
    <div className="grocery-group">
        <div className="grocery-group-name">
            {props.group.groupName}
        </div>
        {props.group.groceries.map((g, index) => {
            return <Grocery key={index} grocery={g}></Grocery>
        })}
    </div>;

    return content;
}

export default GroceryGroup;