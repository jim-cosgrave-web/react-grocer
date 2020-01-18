import React, { useState, useEffect } from 'react';

import {
    BrowserRouter as Router,
    useParams
} from "react-router-dom";

import axios from 'axios';
import StoreCategoryList from './../StoreCategoryList/StoreCategoryList';

function StoreDetails(props) {
    let { id } = useParams();
    const [store, setStore] = useState(null);

    useEffect(() => {
        axios.post('http://localhost:2584/api/Store/getStore/', { storeId: id })
          .then(res => {
              console.log(res.data);
              setStore(res.data.stores[0]);
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
                <StoreCategoryList categories={store.categories}></StoreCategoryList>
              </div>
            </div> 
            : <div>Loading</div>
            }
        </div>
    );
}

export default StoreDetails;