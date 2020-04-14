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

    const handleGroceryCategoryChange = (category, grocery, newCategoryName) => {
        //
        // Remove from current category
        //
        const gIndex = category.groceries.indexOf(grocery);
        category.groceries.splice(gIndex, 1);

        let categoriesClone = categories.slice();
        const cIndex = categoriesClone.indexOf(category);
        categoriesClone[cIndex] = category;

        let newCategory = categoriesClone.find(c => c.name == newCategoryName);
        newCategory.groceries.push(grocery);

        setCategories(categoriesClone);

        const body = {
            "groceryName": grocery.groceryName,
            "currentCategoryName": category.name,
            "newCategoryName": newCategoryName
        };

        const url = env.apiPrefix + 'stores/' + props.storeId + '/changeGroceryCategory';

        axios.put(url, body);
    }

    return (
        <div>
            <div className="flex-grid">
                {categories && categories.map((category, index) => {
                    return <StoreCategory 
                        key={category.name} 
                        category={category} 
                        onMove={handleMove} 
                        storeId={props.storeId}
                        categoryList={props.categoryList}
                        onGroceryCategoryChange={handleGroceryCategoryChange}>
                    </StoreCategory>
                })}

            </div>
            <div>
                <input ref={inputRef} placeholder="Add a category..." onKeyPress={handleKeyPress} />
            </div>
        </div>
    );
}

export default StoreCategoryList;