import React, { useState } from 'react';
import Reorder from 'react-reorder';
import StoreCategory from './../StoreCategory/StoreCategory';
import axios from 'axios';
import env from './../../Shared/Environment';

function StoreCategoryList(props) {
    const [categories, setCategories] = useState(props.categories);
    const inputRef = React.createRef();

    const handleMove = (category, direction) => {
        let workingSet = categories.slice();
        const newOrder = category.order + direction;

        //
        // Dont go less than one
        //
        if (newOrder < 1) {
            return;
        }

        //
        // Dont go over the end of the array
        //
        if (newOrder > categories.length) {
            return;
        }

        const updateModel = {};
        updateModel.category = category.name;
        updateModel.currentCategory = { name: category.name, order: category.order };
        updateModel.updatedCategory = { name: category.name, order: newOrder };

        const swap = workingSet.find(c => c.order == newOrder);
        swap.order = category.order;
        category.order = newOrder;

        workingSet.sort(function (a, b) {
            return a.order - b.order;
        });

        setCategories(workingSet);
        updateCategory(updateModel);
    }

    const updateCategory = (category) => {
        axios.put(env.apiPrefix + 'stores/' + props.storeId + '/category', category);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addCategory();
        }
    }

    const addCategory = () => {
        const inputText = inputRef.current.value
        const body = { category: inputText };
        inputRef.current.value = '';
        inputRef.current.focus();
        
        axios.post(env.apiPrefix + 'stores/' + props.storeId + '/category', body).then(res => {
            setCategories(res.data);
        });
    }

    return (
        <div>
            <div className="flex-grid">
                {categories && categories.map((category, index) => {
                    return <StoreCategory key={index} category={category} onMove={handleMove} storeId={props.storeId}></StoreCategory>
                })}
                
            </div>
            <div>
                    <input ref={inputRef} placeholder="Add a category..." onKeyPress={handleKeyPress} />
                </div>
        </div>
    );
}

export default StoreCategoryList;