import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';
import GrocerySearch from '../GroceryList/GrocerySearch/GrocerySearch';

import { useParams } from "react-router-dom";

const AddEditRecipe = (props) => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState({ name: '', link: '', categories: [], ingredients: [] });

    const nameInputRef = React.createRef();
    const linkInputRef = React.createRef();

    useEffect(() => {
        if (recipeId != 'new') {
            const user_id = localStorage.getItem('user_id');

            axios.get(env.apiPrefix + 'recipes/' + user_id + '/' + recipeId).then(res => {
                setRecipe(res.data);
            });
        } else {
            console.log('new recipe');
        }
    }, []);

    const save = () => {
        let clone = { ...recipe };
        clone.name = nameInputRef.current.value;
        console.log(clone);
    }

    const handleAddIngredient = (ingredient) => {
        let clone = { ...recipe };
        clone.ingredients.push({ name: ingredient });
        setRecipe(clone);
    }

    let content = (
        <div style={{ maxWidth: "600px" }}>
            <h2>Edit Recipe</h2>
            <div className="edit-recipe-container">
                <div>
                    <h5>Name</h5>
                    <input ref={nameInputRef} defaultValue={recipe.name}></input>
                </div>
                <div>
                    <h5>Link</h5>
                    <input ref={linkInputRef} defaultValue={recipe.link}></input>
                </div>
                <div>
                    <h5>Ingredients</h5>
                    <div>
                        <GrocerySearch onAdd={handleAddIngredient}></GrocerySearch>
                    </div>
                    <div>
                        <ul style={{ marginTop: "10px" }}>
                        {recipe.ingredients && recipe.ingredients.map((i, index) => {
                            return (
                                <li key={i.name}>{i.name}</li>
                            );
                        })}
                        </ul>
                    </div>
                </div>
                <div>
                    <button onClick={save}>Save</button>
                </div>
            </div>
        </div>
    );

    return content;
}

export default AddEditRecipe;