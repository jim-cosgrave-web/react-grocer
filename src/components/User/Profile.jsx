import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';

import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import MyTypeahead from './../Shared/Typeahead/Typeahead';

const Profile = (props) => {
    const [user, setUser] = useState(null);
    const [stores, setStores] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');

        if (!user_id) {
            history.push('/list');
        }

        axios.get(env.apiPrefix + 'users/' + user_id).then(res => {
            if (res.data && res.data.length == 1) {
                const userData = res.data[0];
                setUser(userData);

                if (userData && userData.stores && userData.stores.length > 0) {
                    const storeIds = userData.stores.map(s => s.store_id);

                    axios.post(env.apiPrefix + 'stores/userstores', { storeIds: storeIds }).then(storeRes => {
                        setStores(storeRes.data);
                    });
                }
            } else {
                history.push('/list');
            }
        });
    }, []);

    const handleAddStore = (store) => {
        //console.log(store);
        let clone = stores.slice();
        let existing = clone.find(s => s._id.toString() === store.id.toString());

        if (!existing) {
            let newOption = { _id: store.id.toString(), name: store.label };
            clone.push(newOption);
            setStores(clone);

            let body = { store: { store_id: newOption._id, name: newOption.name } };
            axios.post(env.apiPrefix + 'users/subscribeToStore', body);
        }
    }

    const getStoreLabel = (store) => {
        return store.name + (store.city ? ' (' + store.city + ' ' + store.state + ')' : '');
    }

    const handleUnsubscribe = (store) => {
        const body = { store: store };

        let clone = stores.slice();
        let index = clone.map(function(s) { return s.store_id ;}).indexOf(store._id.toString());
        clone.splice(index, 1);

        setStores(clone);

        axios.post(env.apiPrefix + 'users/unsubscribeFromStore', body);
    }

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
    }

    return (
        <div className="profile-wrapper">
            <div className="flex">
                <h2>Profile</h2>
                <div>
                    <a href="#" onClick={(e) => handleLogout(e)}>Logout</a>
                </div>
            </div>
            {user &&
                <div>
                    <div className="mt-20">
                        <h5>Name</h5>
                        <div>
                            {user.name}
                        </div>
                    </div>
                    <div className="mt-20">
                        <h5>Email</h5>
                        <div>
                            {user.email}
                        </div>
                    </div>
                    <div className="mt-20">
                        <h5>Username</h5>
                        <div>
                            {user.username}
                        </div>
                    </div>
                    <div className="mt-20">
                        <h5>My Stores</h5>
                        <div className="ul-container" style={{ marginTop: "10px" }}>
                            {stores && stores.map((store, index) => {
                                return (
                                    <div key={store._id.toString()} className="ul-item clickable">
                                        <div>
                                            {getStoreLabel(store)}
                                        </div>
                                        <div>
                                            <FontAwesomeIcon title="unsubscribe" icon={faMinusCircle} onClick={() => handleUnsubscribe(store)} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <MyTypeahead type="stores" placeholder="Subscribe to a store" onAdd={handleAddStore}></MyTypeahead>
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default Profile;