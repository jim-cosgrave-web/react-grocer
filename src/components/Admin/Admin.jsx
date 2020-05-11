import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoreCard from '../Store/StoreCard';
import env from '../Shared/Environment';

import { useRouteMatch, Link } from "react-router-dom";

function Admin() {
    const [stores, setStores] = useState(null);

    useEffect(() => {
        axios.get(env.apiPrefix + 'stores')
            .then(res => {
                setStores(res.data);
            });
    }, []);

    return (
        <div className="admin-wrapper">
            <h2>Admin</h2>
            <div style={{ marginTop: "10px" }}>
                <Link to="/admin/edit/new">
                    <div className="g-btn g-btn-large btn-warning bold noselect">Add a New Store</div>
                </Link>
            </div>
            <div style={{ marginTop: "10px" }}>
                {stores && stores.map((store, index) => {
                    return <StoreCard key={index} store={store}></StoreCard>
                })}
            </div>
        </div>
    );
}

export default Admin;