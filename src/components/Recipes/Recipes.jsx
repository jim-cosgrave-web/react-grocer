import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';

import {
    Link
} from "react-router-dom";

const Recipes = (props) => {
    let [recipes, setRecipes] = useState(null);

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');

        axios.get(env.apiPrefix + 'recipes/' + user_id).then(res => {
            setRecipes(res.data);
        });
    }, []);

    let content = (
        <div style={{ maxWidth: "600px" }}>
            <h2>Recipes</h2>
            {/* <div className="list-btn-container">
                <div className="g-btn g-btn-large btn-hide btn-warning noselect">List</div>
                <div className="g-btn g-btn-large btn-clear btn-danger noselect">Categories</div>
            </div> */}
            
                <Link to="/recipes/edit/new">Add New Recipe</Link>
            
            <div className="recipe-list">
                {recipes && recipes.map((r, index) => {
                    return (
                        <Link key={r._id} to={`/recipes/${r._id.toString()}`}>
                            <div className="recipe-list-item">
                                {r.name}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    return content;
}

export default Recipes;