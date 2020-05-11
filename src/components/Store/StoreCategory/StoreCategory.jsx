import React, { useState } from 'react';

import axios from 'axios';
import env from './../../Shared/Environment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faArrowUp, faArrowDown, faTrashAlt, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

import MyTypeahead from '../../Shared/Typeahead/Typeahead';

function StoreCategory(props) {
    // { category, onMove, storeId, categoryList, onGroceryCategoryChange }
    const [category, setCategory] = useState(props.category);
    const [groceries, setGroceries] = useState(props.category.groceries);
    const [editing, setEditing] = useState(false);
    const inputRef = React.createRef();
    const iCategoryNameRef = React.createRef();

    const moveLeft = () => {
        props.onMove(category, -1);
    }

    const moveRight = () => {
        props.onMove(category, 1);
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
        axios.put(env.apiPrefix + 'stores/' + props.storeId + '/grocery', updateModel);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addGrocery();
        }
    }

    const addGrocery = (grocery) => {
        const inputText = grocery;
        const body = { category: category.name, groceryName: inputText };

        axios.post(env.apiPrefix + 'stores/' + props.storeId + '/grocery', body).then((res) => {
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

        axios.delete(env.apiPrefix + 'stores/' + props.storeId + '/grocery', body).then((res) => {
            console.log(res);
            let workingSet = groceries.slice();
            const index = workingSet.indexOf(grocery);
            workingSet.splice(index, 1);
            setGroceries(workingSet);
        });
    }

    const handleCategoryChange = (event, grocery) => {
        props.onGroceryCategoryChange(category, grocery, event.target.value);
    }

    const toggleEdit = (value) => {
        setEditing(value);

        if (!value) {
            let clone = { ...category };
            const change = clone.name != iCategoryNameRef.current.value;

            if (change) {
                clone.name = iCategoryNameRef.current.value;
                const body = { currentCategory: category, updatedCategory: clone }
                setCategory(clone);
                axios.put(env.apiPrefix + 'stores/' + props.storeId + '/category', body);
            }
        }
    }

    const handleCategoryNameKeyUp = (event) => {
        if (event.key === 'Enter') {
            toggleEdit(false);
        }
    }

    return (
        <div className="card grocery-category-card">
            <div className="category-header flex-grid">
                <div>
                    {!editing &&
                        <div className="flex category-name">
                            <div>{category.name}</div>
                            <div>
                                <FontAwesomeIcon className="clickable" onClick={() => toggleEdit(true)} icon={faEdit} />
                            </div>
                        </div>
                    }
                    {editing &&
                        <div className="flex category-name">
                            <div>
                                <input ref={iCategoryNameRef} defaultValue={category.name} onKeyUp={handleCategoryNameKeyUp}></input>
                            </div>
                            <div>
                                <FontAwesomeIcon className="clickable" onClick={() => toggleEdit(false)} icon={faSave} />
                            </div>
                        </div>
                    }
                </div>
                <div className="store-category-arrows">
                    <div>
                        <FontAwesomeIcon className="clickable" onClick={moveLeft} icon={faArrowLeft} />
                    </div>
                    <div>
                        <FontAwesomeIcon className="clickable" onClick={moveRight} icon={faArrowRight} />
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div>
                    <MyTypeahead type="groceries" placeholder="Add a grocery" onAdd={addGrocery}></MyTypeahead>
                </div>
                <div className="store-category-groceries">
                    {groceries && groceries.map((grocery, index) => {
                        return (
                            <div className="store-category-grocery" key={index}>
                                <div className="flex">
                                    <div>
                                        {grocery.groceryName}
                                    </div>
                                    <div>
                                        <FontAwesomeIcon className="clickable" onClick={() => moveGroceryUp(grocery)} icon={faArrowUp} />
                                        <FontAwesomeIcon className="clickable" onClick={() => moveGroceryDown(grocery)} icon={faArrowDown} />
                                        <FontAwesomeIcon className="clickable" onClick={() => deleteGrocery(grocery)} icon={faTrashAlt} />
                                    </div>
                                </div>

                                <select onChange={(event) => handleCategoryChange(event, grocery)} value={category.name}>
                                    {props.categoryList.map((c, i) => { return <option key={c.name} defaultValue={c.name}>{c.name}</option>; })}
                                </select>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default StoreCategory;