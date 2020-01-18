import React, { useState, useEffect } from 'react';

const Grocery = (props) => {
    const [grocery, setGrocery] = useState(props.grocery);
    const [checked, setChecked] = useState(props.grocery.checked);
    console.log('rendering');

    const handleCheck = (e) => {
        setChecked(!checked);
    }

    let content = 
    <div className="grocery">
        <div className="grocery-name">
            <div>
            { grocery.name }
            </div>
            {grocery.notes && 
                <div className="note">
                    { grocery.notes }
                </div>}
        </div>
        <div className="grocery-check-container">
            <input onChange={handleCheck} type="checkbox" defaultChecked={grocery.checked}></input>
            <div>
                {checked ? <span>yes</span> : <span>no</span>}
            </div>
        </div>
    </div>;

    return content;
}

export default Grocery;