import React, { useState } from 'react';

const Grocery = (props) => {
    const [grocery, setGrocery] = useState(props.grocery);
    const inputRef = React.createRef();
    let updateTimeout = null;

    const handleKeyPress = () => {
        raiseOnInteraction();

        if (updateTimeout) { 
            clearTimeout(updateTimeout);
        }

        updateTimeout = setTimeout(() => {
            if (inputRef && inputRef.current) {
                grocery.note = inputRef.current.value;
                setGrocery(grocery);
                props.update(grocery);
            }
        }, 500);
    }

    const raiseOnInteraction = () => {
        if (typeof props.onInteraction == 'function') { 
            props.onInteraction();
        }
    }

    const handleCategoryChange = (event) => {
        raiseOnInteraction();
        // this.setState({value: event.target.value});
        //console.log(event.target.value, grocery);
        props.onCategorySet(event.target.value, grocery);
    }

    const handleGroceryClick = (event) => {
        if (event.target.className.indexOf('prevent-click') === -1) {
            if (typeof (props.onClick) == 'function') {
                grocery.checked = !grocery.checked;
                props.onClick(grocery);
                raiseOnInteraction();

                let clone = { ...grocery };
                setGrocery(clone);
            }
        }
    }

    let content = (
        <div className={"list-item" + (grocery.checked ? ' checked' : '')} onClick={handleGroceryClick}>
            <div className="list-item-name">{grocery.name}</div>
            <div className="list-item-note">
                <input className="prevent-click" ref={inputRef} onKeyUp={handleKeyPress} defaultValue={grocery.note}></input>
            </div>
            {props.uncategorized && (
                <div className="list-item-category">
                    <select className="prevent-click" onChange={handleCategoryChange}>
                        {props.categories.map((c, i) => { return <option key={c.name} defaultValue={c.name}>{c.name}</option>; })}
                    </select>
                </div>
            )}
        </div>
    )

    return content;
}

export default Grocery;