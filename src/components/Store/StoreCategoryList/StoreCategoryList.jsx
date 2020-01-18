import React, { useState } from 'react';
import Reorder from 'react-reorder';
import StoreCategory from './../StoreCategory/StoreCategory';

function StoreCategoryList(props) {
    const [categories, setCategories] = useState(props.categories);

    const handleMove = (category, direction) => {
        const workingSet = categories.slice();
        const i = workingSet.indexOf(category);
        const deleted = workingSet.splice(i, 1)[0];
        let movement = i + direction;

        if(movement < 0 || movement > workingSet.length) {
            return;
        }

        workingSet.splice(movement, 0, deleted);
        setCategories(workingSet);
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