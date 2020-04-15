import React, { useState } from 'react';

import axios from 'axios';
import env from './../../Shared/Environment';

function StoreCategory({ category, onMove, storeId, categoryList, onGroceryCategoryChange }) {
    const [groceries, setGroceries] = useState(category.groceries);
    const [editing, setEditing] = useState(false);
    const inputRef = React.createRef();
    const iCategoryNameRef = React.createRef();

    const moveLeft = () => {
        onMove(category, -1);
    }

    const moveRight = () => {
        onMove(category, 1);
    }

    const moveGroceryUp = (grocery) => {
        moveGrocery(grocery, -1);
    }

    const moveGroceryDown = (grocery) => {
        moveGrocery(grocery, 1);
    }

    const moveGrocery = (grocery, direction) => {
        let workingSet = groceries.slice();
        const newOrder = grocery.order + direction;

        //
        // Dont go less than one
        //
        if (newOrder < 1) {
            return;
        }

        //
        // Dont go over the end of the array
        //
        if (newOrder > workingSet.length) {
            return;
        }

        const updateModel = {};
        updateModel.category = category.name;
        updateModel.currentGrocery = { groceryName: grocery.groceryName, order: grocery.order };
        updateModel.updatedGrocery = { groceryName: grocery.groceryName, order: newOrder };

        const swap = workingSet.find(c => c.order == newOrder);
        swap.order = grocery.order;
        grocery.order = newOrder;

        workingSet.sort((a, b) => { return a.order - b.order; });
        setGroceries(workingSet);
        axios.put(env.apiPrefix + 'stores/' + storeId + '/grocery', updateModel);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addGrocery();
        }
    }

    const addGrocery = () => {
        const inputText = inputRef.current.value
        const body = { category: category.name, groceryName: inputText };
        inputRef.current.value = '';
        inputRef.current.focus();

        axios.post(env.apiPrefix + 'stores/' + storeId + '/grocery', body).then((res) => {
            const newGrocery = res.data;
            let workingSet = groceries.slice();
            workingSet.push(newGrocery);
            setGroceries(workingSet);
        });
    }

    const deleteGrocery = (grocery) => {
        const body = {
            data: {
                "category": category.name,
                "groceryName": grocery.groceryName
            }
        };

        axios.delete(env.apiPrefix + 'stores/' + storeId + '/grocery', body).then((res) => {
            console.log(res);
            let workingSet = groceries.slice();
            const index = workingSet.indexOf(grocery);
            workingSet.splice(index, 1);
            setGroceries(workingSet);
        });
    }

    const handleCategoryChange = (event, grocery) => {
        onGroceryCategoryChange(category, grocery, event.target.value);
    }

    const toggleEdit = (value) => {
        setEditing(value);

        if (!value) {
            let clone = { ...category };
            const change = clone.name != iCategoryNameRef.current.value;

            if (change) {
                clone.name = iCategoryNameRef.current.value;
                const body = { currentCategory: category, updatedCategory: clone }
                category = clone;
                axios.put(env.apiPrefix + 'stores/' + storeId + '/category', body);
            }
        }
    }

    return (
        <div className="card grocery-category-card">
            <div className="card-header flex-grid">
                <div>
                    {!editing &&
                        <div>
                            <span>{category.name}</span>
                            <button onClick={() => toggleEdit(true)}>Edit</button>
                        </div>
                    }
                    {editing &&
                        <div>
                            <input ref={iCategoryNameRef} defaultValue={category.name}></input>
                            <button onClick={() => toggleEdit(false)}>Save</button>
                        </div>
                    }
                </div>
                <div>
                    <button onClick={moveLeft}>&lt;&lt;</button>
                    <button onClick={moveRight}>&gt;&gt;</button>
                </div>
            </div>
            <div className="card-body">
                <div className="add-grocery-container">
                    <div>
                        <input ref={inputRef} placeholder="Add a grocery..." onKeyPress={handleKeyPress} />
                    </div>
                    <div>
                        <button onClick={addGrocery}>Add</button>
                    </div>
                </div>
                {groceries && groceries.map((grocery, index) => {
                    return (
                        <div key={index}>
                            <button onClick={() => moveGroceryUp(grocery)}>^</button>
                            <button onClick={() => moveGroceryDown(grocery)}>v</button>
                            <button onClick={() => deleteGrocery(grocery)}>X</button>
                            <select onChange={(event) => handleCategoryChange(event, grocery)} value={category.name}>
                                {categoryList.map((c, i) => { return <option key={c.name} defaultValue={c.name}>{c.name}</option>; })}
                            </select>
                            {grocery.groceryName}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default StoreCategory;