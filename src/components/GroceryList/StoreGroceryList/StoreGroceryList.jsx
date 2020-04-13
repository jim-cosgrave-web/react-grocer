import React, { useState, useEffect } from 'react';
import GrocerySearch from '../GrocerySearch/GrocerySearch';
import Grocery from '../Grocery/Grocery';
import GroceryGroup from '../GroceryGroup/GroceryGroup';

import axios from 'axios';
import env from '../../Shared/Environment';

import {
    BrowserRouter as Router,
    useParams,
    Link
} from "react-router-dom";

const StoreGroceryList = (props) => {
    const [stores, setStores] = useState([]);
    const [storeDropDown, setStoreDropDown] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [list, setList] = useState(null);

    let { listId } = useParams();

    useEffect(() => {
        getStores();
    }, []);

    const getStores = () => {
        axios.get(env.apiPrefix + 'stores').then((res) => {
            const storeData = res.data;
            setStores(storeData);

            const ddl = [];
            storeData.forEach(s => {
                ddl.push({ name: s.name, value: s._id });
            });

            const tempSelectedStore = ddl[0];

            setStoreDropDown(ddl);
            setSelectedStore(tempSelectedStore);

            getStoreGroceryList(tempSelectedStore);
        });
    }

    const getStoreGroceryList = (store) => {
        const url = env.apiPrefix + 'list/' + listId + '/' + store.value;

        axios.get(env.apiPrefix + 'list/' + listId + '/' + store.value).then(res => {
            setList(res.data);
        });
    }

    const updateGrocery = (grocery) => {
        const body = { list_id: listId, grocery: grocery };

        axios.put(env.apiPrefix + 'list/grocery', body);
    }

    const changeHandler = (value) => {
        const body = {
            "list_id": listId,
            "grocery": {
                "name": value
            }
        };

        const grocery = list.groceries.find(g => g.name == value);

        if (!grocery) {
            axios.post(env.apiPrefix + 'list/grocery', body).then(res => {
                setList(res.data);
            });
        }
    }

    const handleCategorySet = (categoryName, grocery) => {
        const newList = {...list};

        //
        // Remove from uncategorized
        //
        const uncategorized = newList.list.find(c => c.uncategorized);
        const groceryToMove = uncategorized.groceries.find(g => g.name == grocery.name);
        const index = uncategorized.groceries.indexOf(groceryToMove);
        uncategorized.groceries.splice(index, 1);

        uncategorized.hidden = uncategorized.groceries.length == 0;
        
        //
        // Add to the new category
        //
        let newCategory = newList.list.find(c => c.name == categoryName);

        if(!newCategory) {
            newCategory = { name: categoryName, groceries: [] };
            newList.list.push(newCategory);
        }

        newCategory.hidden = false;
        newCategory.groceries.push(groceryToMove);

        setList(newList);
    }

    let content = (
        <div style={{ maxWidth: "600px" }}>
            <div>
                <Link className="g-btn" to="/">Home</Link>
            </div>
            <div>
                <select>
                    {storeDropDown && storeDropDown.map((s, index) => {
                        return (
                            <option key={s.value} defaultValue={s.value}>
                                {s.name}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div style={{ marginTop: "16px" }}>
                <GrocerySearch onChange={changeHandler}></GrocerySearch>
            </div>
            <div style={{ marginTop: "16px" }}>
                {list && list.list.map((c, cIndex) => {
                    return (
                        !c.hidden && <div className="list-category" key={cIndex}>
                            <div className="list-category-name">
                                {c.name}
                            </div>
                            <div className="list">
                                {c.groceries && c.groceries.map((g, gIndex) => {
                                    return <Grocery
                                        grocery={g}
                                        key={g.name}
                                        update={updateGrocery}
                                        uncategorized={c.uncategorized}
                                        categories={list.categories}
                                        onCategorySet={handleCategorySet}
                                    ></Grocery>
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: "16px" }}>
                <GrocerySearch onChange={changeHandler}></GrocerySearch>
            </div>
        </div>
    );

    return content;
}

export default StoreGroceryList;