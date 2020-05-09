import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';

import { Link } from "react-router-dom";

const Recipes = (props) => {
    let [recipes, setRecipes] = useState(null);
    let [recipeCache, setRecipeCache] = useState(null);
    let searchRef = React.createRef();

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');

        axios.get(env.apiPrefix + 'recipes/' + user_id).then(res => {
            const recipeData = res.data;

            if(recipeData) {
                recipeData.sort(compareNames);
            }

            setRecipes(recipeData);
            setRecipeCache(recipeData);
        });
    }, []);

    const search = () => {
        let value = searchRef.current.value;

        if (value.trim() != '') {
            let clone = [...recipeCache];

            value = value.trim().toLowerCase();

            clone = clone.filter(function (recipe) {
                const nameMatch = recipe.name.trim().toLowerCase().indexOf(value) > -1;
                const categoryMatch = recipe.categories.find(c => c.trim().toLowerCase().indexOf(value) > -1);

                return nameMatch || categoryMatch;
            });

            setRecipes(clone);
        } else {
            setRecipes(recipeCache);
        }
    }

    const compareNames = (a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }

    let content = (
        <div className="recipes-container" style={{ maxWidth: "600px" }}>
            <h2>Recipes</h2>
            {/* <div className="list-btn-container">
                <div className="g-btn g-btn-large btn-hide btn-warning noselect">List</div>
                <div className="g-btn g-btn-large btn-clear btn-danger noselect">Categories</div>
            </div> */}
            <div style={{ maxWidth: "600px" }}>
                <Link to="/recipes/edit/new">
                    <div className="g-btn g-btn-large btn-warning noselect">Add New Recipe</div>
                </Link>
            </div>
            <div style={{ maxWidth: "600px", marginTop: "10px" }}>
                <input ref={searchRef} placeholder="Search names or categories" onKeyUp={search}></input>
            </div>
            <div className="recipe-list">
                {recipes && recipes.map((r, index) => {
                    return (
                        <div className="recipe-item" key={r._id}>
                        <Link to={`/recipes/${r._id.toString()}`}>
                            <div className="recipe-list-item">
                                {r.name}
                            </div>
                        </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return content;
}

export default Recipes;