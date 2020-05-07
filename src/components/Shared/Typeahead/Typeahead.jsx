import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../../Shared/Environment';
import { Typeahead } from 'react-bootstrap-typeahead';
import { compare } from './../../../utils/compare';

const MyTypeahead = (props) => {
    const [options, setOptions] = useState([]);
    const ref = React.createRef();

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        if (props.type === 'groceries') {
            axios.get(env.apiPrefix + 'groceries')
                .then(res => {
                    if (res.data) {
                        const values = res.data.sort(compare);
                        const names = values.map(v => { return v.name; });
                        const uniqueSet = new Set(names);

                        setOptions([...uniqueSet]);
                    }
                }).catch(res => {
                    console.error(res);
                });
        } else if (props.type === 'recipe-category') {
            axios.get(env.apiPrefix + 'recipes/categories')
                .then(res => {
                    if (res.data) {
                        const values = res.data.sort(compare);
                        const names = values.map(v => { return v.name; });
                        const uniqueSet = new Set(names);

                        setOptions([...uniqueSet]);
                    }
                }).catch(res => {
                    console.error(res);
                });
        }
    }

    const handleAddClick = () => {
        if (ref && ref.current && ref.current.getInput()) {
            const value = ref.current.getInput().value;

            if (value.trim() != '') {
                props.onAdd(value);
                ref.current.clear();
            }
        }
    }

    const handleKeyDown = (event) => {
        if (event.key.toLowerCase() === 'enter') {
            handleAddClick();
        }
    }

    let content = (
        <div className="grocery-search">
            <Typeahead
                id="typeahead"
                ref={ref}
                options={options}
                onKeyDown={handleKeyDown}
                onChange={handleAddClick}
                maxHeight="200px"
                placeholder={props.placeholder}
            />
            <div className="g-btn search-add-btn" onClick={handleAddClick}>
                Add
            </div>
        </div>
    );

    return content;
}

export default MyTypeahead;