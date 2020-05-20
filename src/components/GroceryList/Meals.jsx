import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import MyTypeahead from './../Shared/Typeahead/Typeahead';

const Meals = (props) => {
    const [meals, setMeals] = useState([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        meals.push({ name: 'Tacos' });
        meals.push({ name: 'Hamburgers' });
    }, []);

    const handleAddMeal = (meal) => {
        const existing = meals.find(m => { return m.name.trim().toLowerCase() == meal.trim().toLowerCase() });
        
        if(!existing) {
            const clone = meals.slice();
            clone.push({ name: meal });
            setMeals(clone);
        }
    }

    const handleRemoveMealClick = (meal) => {
        const existing = meals.find(m => { return m.name.trim().toLowerCase() == meal.name.trim().toLowerCase() });
        const index = meals.indexOf(existing);
        const clone = meals.slice();
        clone.splice(index, 1);
        setMeals(clone);
    }

    let content = (
        <div className="meals-container">
            <div className="flex clickable meals-header" onClick={() => setExpanded(!expanded)}>
                <div>Meals</div>
                <div>
                    {!expanded && <FontAwesomeIcon icon={faArrowDown} />}
                    {expanded && <FontAwesomeIcon icon={faArrowUp} />}
                </div>
            </div>
            {expanded && <div style={{ "marginBottom": "40px" }}>
                <div>
                    <MyTypeahead placeholder="Add a meal" onAdd={handleAddMeal}></MyTypeahead>
                </div>
                <div>
                    <div className="ul-container" style={{ marginTop: "10px" }}>
                        {meals && meals.map((meal, index) => {
                            return (
                                <div key={index} className="ul-item clickable">
                                    <div>
                                        {meal.name}
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faTrashAlt} onClick={() => handleRemoveMealClick(meal)} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>}
        </div>
    );

    return content;
}

export default Meals;