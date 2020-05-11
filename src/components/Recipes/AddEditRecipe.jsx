import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';
import MyTypeahead from '../Shared/Typeahead/Typeahead';

import { Link, useParams, useHistory } from "react-router-dom";
import { findWithAttr } from '../../utils/jsUtilities';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

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
            axios.put(env.apiPrefix + 'recipes', clone).then(res => {
                history.push('/recipes');
            });
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
        let clone = { ...recipe };
        let index = findWithAttr(clone.ingredients, 'name', ingredient.name);
        clone.ingredients.splice(index, 1);
        setRecipe(clone);
    }

    const removeCategory = (category) => {
        let clone = { ...recipe };
        let index = clone.categories.indexOf(category);
        clone.categories.splice(index, 1);
        setRecipe(clone);
    }

    let content = (
        <div style={{ maxWidth: "600px" }}>
            <div className="flex">
                <h2>Edit Recipe</h2>
                <div>
                    <Link to={"/recipes/" + recipeId}><FontAwesomeIcon icon={faMinusSquare} /></Link>
                </div>
            </div>
            <div className="edit-recipe-container">
                <div>
                    <h5>Name</h5>
                    <input type="text" ref={nameInputRef} defaultValue={recipe.name}></input>
                </div>
                <div>
                    <h5>Link</h5>
                    <input type="text" ref={linkInputRef} defaultValue={recipe.link}></input>
                </div>
                <div>
                    <h5>Ingredients</h5>
                    <div>
                        <div className="edit-list-container" style={{ marginTop: "10px" }}>
                            {recipe.ingredients && recipe.ingredients.map((i, index) => {
                                return (
                                    <div key={i.name} className="edit-list edit-list-item">
                                        <div>
                                            {i.name}
                                        </div>
                                        <div>
                                            <FontAwesomeIcon className="clickable" onClick={() => removeIngredient(i)} icon={faTrashAlt} />
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
                                    <div key={i} className="edit-list edit-list-item">
                                        <div>
                                            {i}
                                        </div>
                                        <div>
                                            <FontAwesomeIcon className="clickable" onClick={() => removeCategory(i)} icon={faTrashAlt} />
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
                <div style={{ marginTop: "10px" }}>
                    <div onClick={save} className="g-btn g-btn-large btn-warning noselect">Save</div>
                </div>
            </div>
        </div>
    );

    return content;
}

export default AddEditRecipe;