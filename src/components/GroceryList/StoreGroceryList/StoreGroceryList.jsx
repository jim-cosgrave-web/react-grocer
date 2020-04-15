import React, { useState, useEffect } from 'react';
import GrocerySearch from '../GrocerySearch/GrocerySearch';
import Grocery from '../Grocery/Grocery';
import axios from 'axios';
import env from '../../Shared/Environment';

import {
    useParams
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
                ddl.push({ name: s.name, value: s._id, storeId: s.storeId });
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

        let grocery = null;

        for (let i = 0; i < list.list.length; i++) {
            const category = list.list[i];
            const grocery = category.groceries.find(g => g.name == value);

            if (grocery) {
                break;
            }
        }

        console.log(grocery);


        // if (!grocery) {
        //     axios.post(env.apiPrefix + 'list/grocery', body).then(res => {
        //         getStoreGroceryList(selectedStore.value);
        //     });
        // }
    }

    const handleCategorySet = (categoryName, grocery) => {
        const newList = { ...list };

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

        if (!newCategory) {
            newCategory = { name: categoryName, groceries: [] };
            newList.list.push(newCategory);
        }

        newCategory.hidden = false;
        newCategory.groceries.push(groceryToMove);

        setList(newList);

        const body = { category: categoryName, groceryName: groceryToMove.name };

        axios.post(env.apiPrefix + 'stores/' + selectedStore.storeId + '/grocery', body).then((res) => {
            console.log(res);
        });
    }

    const handleGroceryClick = (grocery) => {
        const body = { list_id: listId, grocery: grocery };
        axios.put(env.apiPrefix + 'list/grocery', body);
    }

    const handleClearClick = () => {

        let clone = { ...list };
        let updateMade = false;
        //debugger;

        for (let i = 0; i < clone.list.length; i++) {
            let indices = [];
            let categories = clone.list[i];

            for (let j = 0; j < categories.groceries.length; j++) {
                if (categories.groceries[j].checked) {
                    indices.push(j);
                }
            }

            if (indices.length > 0) {
                for (let j = indices.length - 1; j >= 0; j--) {
                    clone.list[i].groceries.splice(indices[j], 1);
                }

                updateMade = true;
            }
        }

        if (updateMade) {
            setList(clone);

            const body = { list_id: clone.listId };
            axios.post(env.apiPrefix + 'list/removechecked', body);
        }
    }

    let content = (
        <div style={{ maxWidth: "600px" }}>
            <div>Shopping at {selectedStore && selectedStore.name}</div>
            {storeDropDown && storeDropDown.length > 1 && <div>
                <select style={{ width: "100%" }}>
                    {storeDropDown && storeDropDown.map((s, index) => {
                        return (
                            <option key={s.value} defaultValue={s.value}>
                                {s.name}
                            </option>
                        );
                    })}
                </select>
            </div>}
            <div style={{ marginTop: "16px" }}>
                <GrocerySearch onChange={changeHandler}></GrocerySearch>
            </div>
            <div style={{ marginTop: "16px" }}>
                <div className="g-btn" onClick={handleClearClick}>Clear Crossed-Off Groceries</div>
            </div>
            <div style={{ marginTop: "16px" }}>
                {list && list.list.map((c, cIndex) => {
                    return (
                        !c.hidden && <div className="list-category" key={c.name}>
                            <div className="list-category-name">
                                <div>
                                    {c.name}
                                </div>
                                <div className="item-count">
                                    {c.groceries && c.groceries.length} item(s)
                            </div>
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
                                        onClick={handleGroceryClick}
                                    ></Grocery>
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: "16px" }}>
                {/* <GrocerySearch onChange={changeHandler}></GrocerySearch> */}
            </div>
        </div>
    );

    return content;
}

export default StoreGroceryList;