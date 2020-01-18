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
        axios.get('http://localhost:2584/api/Store')
            .then(res => {
                setStores(res.data.stores);
            });
    }, []);

    return (
        <div>
            <div>
                {stores && stores.map((store, index) => {
                    return <StoreCard key={index} store={store}></StoreCard>
                })}
            </div>
        </div>
    );
}

export default Admin;