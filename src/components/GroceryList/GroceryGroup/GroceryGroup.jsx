import React from 'react';
import Grocery from './../Grocery/Grocery';

const GroceryGroup = (props) => {
    let content = 
    <div className="grocery-group">
        <div className="grocery-group-name">
            {props.group.groupName}
        </div>
        <div className="groceries">
        {props.group.groceries.map((g, index) => {
            return <Grocery key={index} grocery={g}></Grocery>
        })}
        </div>
    </div>;

    return content;
}

export default GroceryGroup;