import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';

import { useParams } from "react-router-dom";

const Recipe = (props) => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');

        axios.get(env.apiPrefix + 'recipes/' + user_id + '/' + recipeId).then(res => {
            setRecipe(res.data);
        });
    }, []);

    let content = (
        <div style={{ maxWidth: "600px" }}>
            {recipe && <div className="recipe-container">
                <h2>{recipe.name}</h2>
                <div>
                    <a target="_blank" href={recipe.link}>Recipe Link</a>
                </div>
                {recipe.ingredients && recipe.ingredients.length > 0 && <div>
                    <div className="recipe-section-title">Ingredients</div>
                    {recipe.ingredients.map((i, index) => {
                        return (
                            <div key={i.name}>{i.name}</div>
                        );
                    })}
                </div>}
                {recipe.categories && recipe.categories.length > 0 && <div>
                    <div className="recipe-section-title">Categories</div>
                    {recipe.categories.map((c, index) => {
                        return (
                            <div key={c}>{c}</div>
                        );
                    })}
                </div>}
            </div>}
            {!recipe && <div>
                Loading...
            </div>}
        </div>
    );

    return content;
}

export default Recipe;