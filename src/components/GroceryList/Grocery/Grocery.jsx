import React, { useState, useEffect } from 'react';

const Grocery = (props) => {
    let content = 
    <div className="grocery">
        { props.grocery.name }
    </div>;

    return content;
}

export default Grocery;