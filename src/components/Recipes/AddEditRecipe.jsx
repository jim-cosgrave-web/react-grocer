import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';
import GrocerySearch from '../GroceryList/GrocerySearch/GrocerySearch';
import MyTypeahead from '../Shared/Typeahead/Typeahead';

import { useParams, useHistory } from "react-router-dom";

const AddEditRecipe = (props) => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState({ name: '', link: '', categories: [], ingredients: [] });

    const nameInputRef = React.createRef();
    const linkInputRef = React.createRef();

    const history = useHistory();

    useEffect(() => {
        if (recipeId != 'new') {
            const user_id = localStorage.getItem('user_id');

            axios.get(env.apiPrefix + 'recipes/' + user_id + '/' + recipeId).then(res => {
                setRecipe(res.data);
            });
        }
    }, []);

    const save = () => {
        let clone = { ...recipe };
        clone.name = nameInputRef.current.value;
        clone.link = linkInputRef.current.value;

        const user_id = localStorage.getItem('user_id');
        clone.user_id = user_id;

        if (recipeId == 'new') {
            axios.post(env.apiPrefix + 'recipes', clone).then(res => {
                history.push('/recipes');
            });
        } else {
            console.log('update instead of post', clone);
        }
    }

    const handleAddIngredient = (ingredient) => {
        let clone = { ...recipe };
        clone.ingredients.push({ name: ingredient });
        setRecipe(clone);
    }

    const handleAddCategory = (category) => {
        let clone = { ...recipe };
        let exists = clone.categories.find(c => c == category);

        if (!exists) {
            clone.categories.push(category);
            setRecipe(clone);

            axios.post(env.apiPrefix + 'recipes/category', { name: category });
        }
    }

    const removeIngredient = (ingredient) => {
        console.log(ingredient);
    }

    const removeCategory = (category) => {
        console.log(category);
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
                        <div className="edit-list-container" style={{ marginTop: "10px" }}>
                            {recipe.ingredients && recipe.ingredients.map((i, index) => {
                                return (
                                    <div key={i.name} className="edit-list">
                                        <div>
                                            {i.name}
                                        </div>
                                        <div>
                                            <button onClick={() => removeIngredient(i)}>Remove</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <MyTypeahead type="groceries" placeholder="Add an ingredient" onAdd={handleAddIngredient}></MyTypeahead>
                    </div>
                </div>
                <div>
                    <h5>Categories</h5>

                    <div>
                        <div className="edit-list-container" style={{ marginTop: "10px" }}>
                            {recipe.categories && recipe.categories.map((i, index) => {
                                return (
                                    <div key={i} className="edit-list">
                                        <div>
                                            {i}
                                        </div>
                                        <div>
                                            <button onClick={() => removeCategory(i)}>Remove</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <MyTypeahead type="recipe-category" placeholder="Add a category" onAdd={handleAddCategory}></MyTypeahead>
                    </div>
                </div>
                <div>
                    <button className="save" onClick={save}>Save</button>
                </div>
            </div>
        </div>
    );

    return content;
}

export default AddEditRecipe;