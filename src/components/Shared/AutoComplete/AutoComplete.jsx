import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AutoComplete(props) {
    const [suggestions, setSuggestions] = useState([]);
    const [listItems, setListItems] = useState([]);
    // The active selection's index
    const [activeSuggestion, setActiveSuggestion] = useState(0);
    // The suggestions that match the user's input
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    // Whether or not the suggestion list is shown
    const [showSuggestions, setShowSuggestions] = useState(false);
    // What the user has entered
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        setSuggestions(props.suggestions);
    }, [props]);

    useEffect(() => {
        const items = [];

        for(let i = 0; i < suggestions.length; i++) {
            const c = suggestions[i];

            items.push(<li key={c.groceryId}>{c.name}</li>);
        }

        setListItems(items);
    }, [suggestions]);

    function onKeyPressed(e) {
        if (e.keyCode === 13) {
            setShowSuggestions(false);
            setUserInput(filteredSuggestions[activeSuggestion].name);
            console.log(filteredSuggestions[activeSuggestion].name);
        } else if (e.keyCode === 38) {
            if(activeSuggestion === 0) {
                return;
            }

            setActiveSuggestion(activeSuggestion - 1);
        } else if (e.keyCode === 40) {
            if(activeSuggestion + 1 === filteredSuggestions.length) {
                return;
            }
            
            setActiveSuggestion(activeSuggestion + 1);
        }
    }

    function onChange(e) {
        const userInput = e.currentTarget.value;
        const filtered = suggestions.filter(
            suggestion => suggestion.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        setFilteredSuggestions(filtered);
        setActiveSuggestion(0);
        setShowSuggestions(true);
        setUserInput(userInput);
    }

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search for a grocery" 
                value={userInput}
                onKeyDown={onKeyPressed}
                onChange={onChange}
            >
            </input>
            {showSuggestions ? 
            <ul className="suggestions">
                {filteredSuggestions.map((suggestion, index) => {
                    let c = suggestion;
                    let className;

                    if (index === activeSuggestion) {
                        className = 'suggestion-active';
                    }

                    return <li className={className} key={c.groceryId}>{c.name}</li>
                })}
            </ul>
            : <div>Nothing to show</div>}
        </div>
    );
}

export default AutoComplete;