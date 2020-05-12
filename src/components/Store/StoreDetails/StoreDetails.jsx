import React, { useState, useEffect } from 'react';

import {
    BrowserRouter as Router,
    useParams
} from "react-router-dom";

import axios from 'axios';
import StoreCategoryList from './../StoreCategoryList/StoreCategoryList';
import env from './../../Shared/Environment';

function StoreDetails(props) {
    let { id } = useParams();
    const [store, setStore] = useState(null);

    useEffect(() => {
        axios.get(env.apiPrefix + 'stores/' + id)
            .then(res => {
                const store = res.data[0];
                let categoryList = [];

                store.categories.forEach(c => {
                    categoryList.push({ name: c.name, value: c.name });
                });

                store.categoryList = categoryList;

                //
                // Sort categories
                //
                store.categories.sort((a, b) => { return a.order - b.order; });

                //
                // Sort category groceries
                //
                for (let i = 0; i < store.categories.length; i++) {
                    const category = store.categories[i];

                    if(category && category.groceries && category.groceries.length > 0) {
                        category.groceries.sort((a, b) => { return a.order - b.order });
                    }
                }

                setStore(store);
            })
    }, []);

    return (
        <div>
            {store ?
                <div>
                    <h2>{store.name} ({store.city} {store.stateProvince})</h2>
                    <div>
                        <StoreCategoryList storeId={store._id} categories={store.categories} categoryList={store.categoryList}></StoreCategoryList>
                    </div>
                </div>
                : <div>Loading</div>
            }
        </div>
    );
}

export default StoreDetails;