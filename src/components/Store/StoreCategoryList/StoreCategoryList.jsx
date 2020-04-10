import React, { useState } from 'react';
import Reorder from 'react-reorder';
import StoreCategory from './../StoreCategory/StoreCategory';
import axios from 'axios';
import env from './../../Shared/Environment';

function StoreCategoryList(props) {
    const [categories, setCategories] = useState(props.categories);

    const handleMove_old = (category, direction) => {
        const workingSet = categories.slice();
        const i = workingSet.indexOf(category);
        const movedCategory = workingSet.splice(i, 1)[0];
        let movement = i + direction;

        if (movement < 0 || movement > workingSet.length) {
            return;
        }

        workingSet.splice(movement, 0, movedCategory);
        setCategories(workingSet);

        const previousSortOrder = movedCategory.sortOrder;
        movedCategory.sortOrder = movedCategory.sortOrder + direction;
        const otherCategory = categories.find(c => c.sortOrder == movedCategory.sortOrder && c.storeCategoryId !== movedCategory.storeCategoryId);
        otherCategory.sortOrder = previousSortOrder;
        //updateCategory(movedCategory);

        let res = categories.map((category) => {
            return { storeCategoryId: category.storeCategoryId, sortOrder: category.sortOrder };
        });
    }

    const handleMove = (category, direction) => {
        //debugger;
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

    return (
        <div>
            <div className="flex-grid">
                {categories && categories.map((category, index) => {
                    return <StoreCategory key={index} category={category} onMove={handleMove} storeId={props.storeId}></StoreCategory>
                })}
            </div>
        </div>
    );
}

export default StoreCategoryList;