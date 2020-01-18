import React, { useState, useEffect } from 'react';
import './Store.scss';

import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";

function StoreCard(props) {
    const store = props.store;
    const [stores, setStores] = useState(null);

    const handleStoreEdit = () => {
        console.log(store.storeId);
    }

    return (
        <div className="store store-card">
            <div className="store-name">{store.name} ({store.city} {store.stateProvince})</div>
            <div className="store-details">
              <Link to={`/admin/store/${store.storeId}`}>Groceries</Link>
              {/* <Link to="/admin/store/:id">Admin</Link> */}
            </div>
        </div>
    )
}

export default StoreCard;