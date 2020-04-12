import React, { useState, useEffect } from 'react';

const Grocery = (props) => {
    const [grocery, setGrocery] = useState(props.grocery);
    const inputRef = React.createRef();
    let updateTimeout = null;

    const handleKeyPress = (event) => {
        if(updateTimeout) {
            clearTimeout(updateTimeout);
        }

        updateTimeout = setTimeout(() => {
            console.log('updating');
            grocery.note = inputRef.current.value;
            setGrocery(grocery);
            props.update(grocery);
        }, 1000);
    }


    let content = (
        <div className="list-item">
            <div className="list-item-name">{grocery.name}</div>
            <div className="list-item-note">
                <input ref={inputRef} onKeyUp={handleKeyPress} defaultValue={grocery.note}></input>
            </div>
        </div>
    )

    return content;
}

export default Grocery;