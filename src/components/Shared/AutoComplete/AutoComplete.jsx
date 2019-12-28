import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AutoComplete = (props) => {
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

    const node = useRef();

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    useEffect(() => {
        setSuggestions(props.suggestions);
    }, [props]);

    const onKeyPressed = (e) => {
        // Enter
        if (e.keyCode === 13) {
            setShowSuggestions(false);
            setUserInput(filteredSuggestions[activeSuggestion].name);
            props.onChange(filteredSuggestions[activeSuggestion]);
        // Up
        } else if (e.keyCode === 38) {
            if(activeSuggestion === 0) {
                return;
            }

            setActiveSuggestion(activeSuggestion - 1);
        // Down
        } else if (e.keyCode === 40) {
            if(activeSuggestion + 1 === filteredSuggestions.length) {
                return;
            }
            
            setActiveSuggestion(activeSuggestion + 1);
        }
    }

    const onChange = (e) => {
        const userInput = e.currentTarget.value;
        const filtered = suggestions.filter(
            suggestion => suggestion.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        setFilteredSuggestions(filtered);
        setActiveSuggestion(0);
        setShowSuggestions(true);
        setUserInput(userInput);
    }

    
    const handleClick = e => {
        if (node.current.contains(e.target)) {
          // inside click
          return;
        }
  
        setShowSuggestions(false);
    };

    const handleSuggestionClick = suggestion => {
        setUserInput(suggestion.name);
        setShowSuggestions(false);
        props.onChange(suggestion);
    }

    let content = (
        <div ref={node} className="auto-complete">
            <input 
                type="text" 
                placeholder="Search for a grocery" 
                value={userInput}
                onKeyDown={onKeyPressed}
                onChange={onChange}
            >
            </input>
            {showSuggestions && (
            <ul className="suggestions">
                {filteredSuggestions.map((suggestion, index) => {
                    let c = suggestion;
                    let className = 'suggestion';

                    if (index === activeSuggestion) {
                        className += ' suggestion-active';
                    }

                    return <li onClick={() => handleSuggestionClick(suggestion)} className={className} key={c.groceryId}>{c.name}</li>
                })}
            </ul>
        )}
        </div>
    );

    return content;
}

export default AutoComplete;