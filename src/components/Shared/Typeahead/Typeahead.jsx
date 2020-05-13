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
        } else if (props.type === 'stores') {
            axios.get(env.apiPrefix + 'stores')
                .then(res => {
                    if (res.data) {
                        let options = [];
                        
                        for (let i = 0; i < res.data.length; i++) {
                            let store = res.data[i];
                            options.push({ id: store._id.toString(), label: store.name + ' (' + store.city + ' ' + store.state + ')' });
                        }

                        //setOptions([{ label: 'Jewel Osco', id: '1' }]);
                        setOptions(options);
                    }
                }).catch(res => {
                    console.error(res);
                });

        }
    }

    const handleAddClick = (selected) => {
        let value = null;

        if (selected && selected.length > 0) {
            value = selected[0];
        } else if (ref && ref.current && ref.current.getInput()) {
            value = ref.current.getInput().value;
        }

        if(!value) {
            console.error('Selected item not found!');
        }

        props.onAdd(value);
        ref.current.clear();
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