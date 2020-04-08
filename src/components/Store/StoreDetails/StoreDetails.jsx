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
                store.categories = store.categories.sort(function (a, b) {
                    return a.order - b.order;
                });
                setStore(store);
            })
    }, []);

    return (
        <div>
            {store ?
                <div>
                    <div className="store">
                        <div className="store-name">{store.name} ({store.city} {store.stateProvince})</div>
                    </div>
                    <div>
                        <StoreCategoryList storeId={store.storeId} categories={store.categories}></StoreCategoryList>
                    </div>
                </div>
                : <div>Loading</div>
            }
        </div>
    );
}

export default StoreDetails;