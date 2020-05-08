import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';

import { Link, useParams, useHistory } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

const Recipe = (props) => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [addGroceryWorkflow, setAddGroceryWorkflow] = useState({ step: 'initial' });

    const history = useHistory();

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');

        axios.get(env.apiPrefix + 'recipes/' + user_id + '/' + recipeId).then(res => {
            const recipe = res.data;

            for (let i = 0; i < recipe.ingredients.length; i++) {
                recipe.ingredients[i].checked = true;
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

    const confirm = () => {
        axios.post(env.apiPrefix + 'list/recipe', recipe).then(res => {
            history.push('/list');
        });
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
                                <div key={i.name} onClick={() => toggleIngredientChecked(i)} className="edit-list edit-list-item clickable">
                                    <div>
                                        {i.name}
                                    </div>
                                    {addGroceryWorkflow.step == 'confirmation' && <div style={{ marginRight: "6px" }}>
                                        {i.checked && <FontAwesomeIcon icon={faCheckSquare} />}
                                        {!i.checked && <FontAwesomeIcon icon={faSquare} />}
                                    </div>}
                                </div>
                            );
                        })}
                    </div>
                </div>}
                {recipe.categories && addGroceryWorkflow.step == 'initial' && recipe.categories.length > 0 && <div className="edit-recipe-container">
                    <div className="recipe-section-title">Categories</div>
                    <div className="edit-list-container" style={{ marginTop: "10px" }}>
                        {recipe.categories.map((c, index) => {
                            return (
                                <div key={c} className="edit-list edit-list-item">
                                    <div>
                                        {c}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>}
                <div style={{ marginTop: "10px" }}>
                {/* {addGroceryWorkflow.step == 'initial' && <button className="save" style={{ width: "100%" }} onClick={addToList}>
                        Add To List
                    </button>} */}
                    {addGroceryWorkflow.step == 'initial' && <div onClick={addToList} className="g-btn g-btn-large btn-warning noselect">Add to List</div>}
                    {addGroceryWorkflow.step == 'confirmation' && <div>
                        <div className="list-btn-container">
                            <div onClick={confirm} className="g-btn g-btn-large btn-hide btn-warning noselect">Confirm</div>
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