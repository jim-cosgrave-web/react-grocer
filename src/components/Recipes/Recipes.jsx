import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';

const Recipes = (props) => {
    let [categories, setCategories] = useState(null);

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');

        axios.get(env.apiPrefix + 'recipes/' + user_id + '/categories').then(res => {
            setCategories(res.data);
        });
    }, []);

    let content = (
        <div style={{ maxWidth: "600px" }}>
            <h2>Recipes</h2>
            <div className="list-btn-container">
                <div className="g-btn g-btn-large btn-hide btn-warning noselect">List</div>
                <div className="g-btn g-btn-large btn-clear btn-danger noselect">Categories</div>
            </div>
            <div className="recipe-category-list">
                {categories && categories.map((c, index) => {
                    return (
                        <div key={c} className="recipe-category">
                            {c}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return content;
}

export default Recipes;