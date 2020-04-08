import React, { useState, useEffect } from 'react';

import {
    BrowserRouter as Router,
    useParams
} from "react-router-dom";

import axios from 'axios';

function StoreList(props) {
    let { id } = useParams();
    const [store, setStore] = useState(null);

    useEffect(() => {
        // axios.post('http://localhost:2584/api/Store/getStore/', { storeId: id })
        //   .then(res => {
        //       console.log(res.data);
        //       setStore(res.data.stores[0]);
        //   })
    }, []);

    return (
        <div>
            Store List
        </div>
    );
}

export default StoreList;