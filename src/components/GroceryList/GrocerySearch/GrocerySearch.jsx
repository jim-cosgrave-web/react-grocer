import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import env from '../../Shared/Environment';
import Autocomplete from 'react-autocomplete';
import { compare } from './../../../utils/compare';

const GrocerySearch = (props) => {
    const [groceries, setGroceries] = useState([]);
    const [count, setCount] = useState(0);
    const [value, setValue] = useState('');

    let items = [];

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get(env.apiPrefix + 'groceries')
            .then(res => {
                if (res.data) {
                    const values = res.data.sort(compare);
                    setGroceries(values);
                }
            }).catch(res => {
                console.error(res);
            });
    }

    const handleSelect = (value) => {
        props.onChange(value);
        setValue('');
    }

    let content = (
        <div className="grocery-search">
            <Autocomplete
                getItemValue={(item) => item.name}
                items={groceries}
                renderItem={(item, isHighlighted) =>
                    <div key={item.name} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                        {item.name}
                    </div>
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onSelect={(val) => { setValue(val); handleSelect(val); }}
                shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
                onKeyPress={() => console.log('test')}
            />
            <button onClick={() => handleSelect(value)}>Add</button>
        </div>
    );

    return content;
}

export default GrocerySearch;