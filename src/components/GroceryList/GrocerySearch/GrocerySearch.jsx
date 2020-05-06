import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../../Shared/Environment';
import { Typeahead } from 'react-bootstrap-typeahead';
import { compare } from './../../../utils/compare';

const GrocerySearch = (props) => {
    const [groceries, setGroceries] = useState([]);
    const [value, setValue] = useState('');
    const ref = React.createRef();

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get(env.apiPrefix + 'groceries')
            .then(res => {
                if (res.data) {
                    const values = res.data.sort(compare);
                    const names = values.map(v => { return v.name; });
                    const uniqueSet = new Set(names);

                    setGroceries([...uniqueSet]);
                }
            }).catch(res => {
                console.error(res);
            });
    }

    const handleAddClick = () => {
        const value = ref.current.getInput().value;

        if (value.trim() != '') {
            props.onAdd(value);
            ref.current.clear();
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
                options={groceries}
                onKeyDown={(event) => {
                    handleKeyDown(event);
                }}
                onChange={handleAddClick}
                maxHeight="200px"
            />
            <div className="g-btn search-add-btn" onClick={handleAddClick}>
                Add
            </div>
        </div>
    );

    return content;
}

export default GrocerySearch;