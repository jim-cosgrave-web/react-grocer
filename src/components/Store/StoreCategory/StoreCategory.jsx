import React, { useEffect, useState } from 'react';

import axios from 'axios';
import env from './../../Shared/Environment';

function StoreCategory({ category, onMove, storeId }) {
    const [groceries, setGroceries] = useState(category.groceries);
    const [newGrocery, setNewGrocery] = useState("");
    const inputRef = React.createRef()

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

    const updateNewGrocery = () => {
        const inputText = inputRef.current.value
        setNewGrocery(inputText)
    }

    const addGrocery = () => {
        const inputText = inputRef.current.value
        const body = { category: category.name, groceryName: inputText };
        axios.post(env.apiPrefix + 'stores/' + storeId + '/grocery', body).then((res) => {
            const newGrocery = res.data;
            let workingSet = groceries.slice();
            workingSet.push(newGrocery);
            setGroceries(workingSet);
        });
    }

    return (
        <div className="card grocery-category-card">
            <div className="card-header flex-grid">
                <div>
                    {category.name}
                </div>
                <div>
                    <button onClick={moveLeft}>&lt;&lt;</button>
                    <button onClick={moveRight}>&gt;&gt;</button>
                </div>
            </div>
            <div className="card-body">
                <div className="add-grocery-container">
                    <div>
                        <input ref={inputRef} placeholder="Add a grocery..." />
                    </div>
                    <div>
                        <button onClick={addGrocery}>Add</button>
                    </div>
                </div>
                {groceries && groceries.map((grocery, index) => {
                    return (
                        <div key={index}>
                            <button onClick={() => moveGroceryUp(grocery)}>Up</button>
                            <button onClick={() => moveGroceryDown(grocery)}>Down</button>
                            {grocery.groceryName}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default StoreCategory;