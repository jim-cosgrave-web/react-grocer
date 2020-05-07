import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';

import { Link, useParams } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

const Recipe = (props) => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [addGroceryWorkflow, setAddGroceryWorkflow] = useState({ step: 'initial' })

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');

        axios.get(env.apiPrefix + 'recipes/' + user_id + '/' + recipeId).then(res => {
            const recipe = res.data;

            for(let i = 0; i < recipe.ingredients.length; i++) {
                recipe.ingredients[i].checked = false;
            }

            setRecipe(res.data);
        });
    }, []);

    const addToList = () => {
        const clone = { ...addGroceryWorkflow };
        clone.step = 'confirmation';
        setAddGroceryWorkflow(clone);
    }

    const cancel = () => {
        const clone = { ...addGroceryWorkflow };
        clone.step = 'initial';
        setAddGroceryWorkflow(clone);
    }

    const toggleIngredientChecked = (ingredient) => {
        const clone = { ...recipe };
        const index = clone.ingredients.indexOf(ingredient);
        clone.ingredients[index].checked = !clone.ingredients[index].checked;
        setRecipe(clone);
    }

    let content = (
        <div style={{ maxWidth: "600px" }}>
            {recipe && <div className="recipe-container">
                <div className="flex">
                    <h2>{recipe.name}</h2>
                    <div>
                        <Link to={"/recipes/edit/" + recipeId}><FontAwesomeIcon icon={faEdit} /></Link>
                    </div>
                </div>
                {recipe.link && <div>
                    <a target="_blank" href={recipe.link}>Recipe Link</a>
                </div>}
                {recipe.ingredients && recipe.ingredients.length > 0 && <div className="edit-recipe-container">
                    <div className="recipe-section-title">Ingredients</div>
                    <div className="edit-list-container" style={{ marginTop: "10px" }}>
                        {recipe.ingredients.map((i, index) => {
                            return (
                                <div key={i.name} className="edit-list">
                                    <div>
                                        {i.name}
                                    </div>
                                    <div  style={{ marginRight: "6px" }}>
                                    {i.checked && <FontAwesomeIcon className="clickable" icon={faCheckSquare} onClick={() => toggleIngredientChecked(i)} />}
                                    {!i.checked && <FontAwesomeIcon className="clickable" icon={faSquare} onClick={() => toggleIngredientChecked(i)} />}
                                    </div>
                                </div>

                            );
                        })}
                    </div>
                </div>}
                {recipe.categories && recipe.categories.length > 0 && <div>
                    <div className="recipe-section-title">Categories</div>
                    {recipe.categories.map((c, index) => {
                        return (
                            <div key={c}>{c}</div>
                        );
                    })}
                </div>}
                <div style={{ marginTop: "10px" }}>
                    {addGroceryWorkflow.step == 'initial' && <button className="save" style={{ width: "100%" }} onClick={addToList}>
                        Add To List
                    </button>}
                    {addGroceryWorkflow.step == 'confirmation' && <div>
                        <div className="list-btn-container">
                            <div className="g-btn g-btn-large btn-hide btn-warning noselect">Add to List</div>
                            <div onClick={cancel} className="g-btn g-btn-large btn-clear btn-danger noselect">Cancel</div>
                        </div>
                    </div>
                    }
                </div>
            </div>}
            {!recipe && <div>
                Loading...
            </div>}
        </div>
    );

    return content;
}

export default Recipe;