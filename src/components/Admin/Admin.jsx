import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoreCard from '../Store/StoreCard';
import env from '../Shared/Environment';

import { 
    useRouteMatch
  } from "react-router-dom";

function Admin() {
    const [stores, setStores] = useState(null);
    
    useEffect(() => {
        axios.get(env.apiPrefix + 'stores')
            .then(res => {
                setStores(res.data);
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