import React from 'react';

import {
    Link
} from "react-router-dom";

function StoreCard(props) {
    const store = props.store;

    return (
        <div className="store store-card">
            <div className="store-name">{store.name} ({store.city} {store.stateProvince})</div>
            <div className="store-details">
              <Link to={`/admin/store/${store._id}`}>Groceries</Link>
              {/* <Link to="/admin/store/:id">Admin</Link> */}
            </div>
        </div>
    )
}

export default StoreCard;