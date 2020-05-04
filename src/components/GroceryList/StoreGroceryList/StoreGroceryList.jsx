import React, { useState, useEffect } from 'react';
import GrocerySearch from '../GrocerySearch/GrocerySearch';
import Grocery from '../Grocery/Grocery';
import { useInterval } from '../../../hooks/useInterval';
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
    const [refreshBlock, setRefreshBlock] = useState(false);
    const [hideGroceries, setHideGroceries] = useState(false);
    const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
    const groceryInputRef = React.createRef();

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
                ddl.push({ name: s.name + ' (' + s.city + ')', value: s._id, storeId: s.storeId });
            });

            const tempSelectedStore = ddl[0];

            setStoreDropDown(ddl);
            setSelectedStore(tempSelectedStore);

            getStoreGroceryList(tempSelectedStore);
        });
    }

    useInterval(() => {
        if(!refreshBlock) {
            console.log('Refreshing data');
            setLastRefreshTime(new Date());
            getStoreGroceryList();
        } else {
            console.log('Refresh blocked due to interaction with grocery');
            setRefreshBlock(false);
        }
    }, 30000);

    const getStoreGroceryList = (store) => {
        if (selectedStore) {
            store = selectedStore;
        }

        if (store) {
            axios.get(env.apiPrefix + 'list/' + listId + '/' + store.value).then(res => {
                setList(res.data);
            });
        }
    }

    const updateGrocery = (grocery) => {
        handleGroceryInteraction();

        const body = { list_id: listId, grocery: grocery };
        axios.put(env.apiPrefix + 'list/grocery', body);
    }

    const handleInputKeyUp = (event) => {
        if (event.key == 'Enter') {
            handleAddGrocery();
        }
    }

    const handleAddGrocery = () => {
        let value = groceryInputRef.current.value;

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

        if (!grocery) {
            handleGroceryInteraction();

            axios.post(env.apiPrefix + 'list/grocery', body).then(res => {
                getStoreGroceryList(selectedStore);
            });
        }

        groceryInputRef.current.value = '';
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
            //console.log(res);
        });
    }

    const handleGroceryClick = (grocery) => {
        const body = { list_id: listId, grocery: grocery };
        //console.log(body);
        axios.put(env.apiPrefix + 'list/grocery', body);

        let clone = { ...list };

        for (let i = 0; i < clone.list.length; i++) {
            let category = clone.list[i];
            const index = category.groceries.map(e => e.name).indexOf(grocery.name);

            if(index != -1) {
                category.groceries[index] = grocery;
                setList(clone);
                break;
            }
        }
    }

    const handleHideClick = () => {
        const hidden = !hideGroceries;

        let clone = { ...list };

        for (let i = 0; i < clone.list.length; i++) {
            let categories = clone.list[i];

            for (let j = 0; j < categories.groceries.length; j++) {
                let grocery = categories.groceries[j]

                if (grocery.checked && hidden) {
                    grocery.hidden = true;
                } else {
                    grocery.hidden = false;
                }
            }
        }

        setHideGroceries(hidden);
    }

    const handleClearClick = () => {
        handleGroceryInteraction();

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

    const handleGroceryInteraction = () => {
        setRefreshBlock(true);
    }

    const formatDateTime = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    }

    let content = (
        <div style={{ maxWidth: "600px" }}>
            <div className="store-title">Shopping at {selectedStore && selectedStore.name}</div>
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
                {/* <GrocerySearch onChange={handleAddGrocery}></GrocerySearch> */}
                <div className="grocery-search">
                    <div>
                        <input type="text" ref={groceryInputRef} onKeyUp={handleInputKeyUp}></input>
                    </div>
                    <div className="g-btn search-add-btn" onClick={handleAddGrocery}>Add</div>
                </div>
            </div>
            <div className="list-btn-container">
                <div className="g-btn g-btn-large btn-hide btn-warning noselect" onClick={handleHideClick}>{hideGroceries ? 'Show' : 'Hide'} Groceries</div>
                <div className="g-btn g-btn-large btn-clear btn-danger noselect" onClick={handleClearClick}>Clear Groceries</div>
            </div>
            <div style={{ marginTop: "16px", textAlign: "right" }}>
                Last refresh at {formatDateTime(lastRefreshTime)}
            </div>
            <div style={{ marginTop: "16px" }}>
                {list && list.list.map((c, cIndex) => {
                    return (
                        !c.hidden && c.groceries.length > 0 && <div className="list-category" key={c.name}>
                            <div className="list-category-name">
                                <div>
                                    {c.name}
                                </div>
                                <div className="item-count">
                                    {c.groceries && c.groceries.filter(g => { return !g.hidden }).length} item(s)
                            </div>
                            </div>

                            <div className="list">
                                {c.groceries && c.groceries.map((g, gIndex) => {
                                    return (!g.hidden && <Grocery
                                        grocery={g}
                                        key={g.name + '_' + g.checked}
                                        update={updateGrocery}
                                        uncategorized={c.uncategorized}
                                        categories={list.categories}
                                        onCategorySet={handleCategorySet}
                                        onClick={handleGroceryClick}
                                        onInteraction={handleGroceryInteraction}
                                    ></Grocery>);
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return content;
}

export default StoreGroceryList;