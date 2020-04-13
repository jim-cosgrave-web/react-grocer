import React, { useState, useEffect } from 'react';

const Grocery = (props) => {
    const [grocery, setGrocery] = useState(props.grocery);
    const inputRef = React.createRef();
    let updateTimeout = null;

    const handleKeyPress = (event) => {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }

        updateTimeout = setTimeout(() => {
            grocery.note = inputRef.current.value;
            setGrocery(grocery);
            props.update(grocery);
        }, 500);
    }

    const handleCategoryChange = (event) => {
        // this.setState({value: event.target.value});
        //console.log(event.target.value, grocery);
        props.onCategorySet(event.target.value, grocery);
    }

    let content = (
        <div className="list-item">
            <div className="list-item-name">{grocery.name}</div>
            {props.uncategorized && (
                <div>
                    <select onChange={handleCategoryChange}>
                        {props.categories.map((c, i) => { return <option key={c.name} defaultValue={c.name}>{c.name}</option>; })}
                    </select>
                </div>
            )}
            <div className="list-item-note">
                <input ref={inputRef} onKeyUp={handleKeyPress} defaultValue={grocery.note}></input>
            </div>
        </div>
    )

    return content;
}

export default Grocery;