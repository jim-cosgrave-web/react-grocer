import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoreCard from '../Store/StoreCard';

import {
    useRouteMatch
  } from "react-router-dom";

function Admin() {
    const [stores, setStores] = useState(null);

    let { path, url } = useRouteMatch();

    useEffect(() => {
        axios.get('https://jpc-express.herokuapp.com/inventory')
            .then(res => {
                //setStores(res.data.stores);
                const inventory = res.data;
                console.log(inventory);
            });
    }, []);

    return (
        <div>
            <div>
                {stores && stores.map((store, index) => {
                    return <StoreCard key={index} store={store}></StoreCard>
                })}
                <div>THIS IS THE ADMIN PAGE</div>
            </div>
        </div>
    );
}

export default Admin;