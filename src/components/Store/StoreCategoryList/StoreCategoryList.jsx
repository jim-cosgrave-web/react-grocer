import React, { useState } from 'react';
import Reorder from 'react-reorder';
import StoreCategory from './../StoreCategory/StoreCategory';
import axios from 'axios';

function StoreCategoryList(props) {
    const [categories, setCategories] = useState(props.categories);

    const handleMove = (category, direction) => {
        const workingSet = categories.slice();
        const i = workingSet.indexOf(category);
        const movedCategory = workingSet.splice(i, 1)[0];
        let movement = i + direction;

        if(movement < 0 || movement > workingSet.length) {
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

        console.log(res);
    }

    const updateCategory = (category) => {
        axios.post('http://localhost:2584/api/store/updateStoreCategory', { storeCategory: category});
    }

    return (
        <div>
            <div className="flex-grid">
                {categories && categories.map((category, index) => {
                    return <StoreCategory key={index} category={category} onMove={handleMove}></StoreCategory>
                })}
            </div>
        </div>
    );
}

export default StoreCategoryList;