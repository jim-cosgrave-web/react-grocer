import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';

import { Link, useHistory } from "react-router-dom";

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

    return (
        <div className="profile-wrapper">
            <h2>Profile</h2>
            {user &&
                <div>
                    <div>
                        <div className="edit-section-title">
                            Name
                        </div>
                        <div>
                            {user.name}
                        </div>
                    </div>
                    <div>
                        <div className="edit-section-title">
                            Email
                        </div>
                        <div>
                            {user.email}
                        </div>
                    </div>
                    <div>
                        <div className="edit-section-title">
                            Username
                        </div>
                        <div>
                            {user.username}
                        </div>
                    </div>
                    <div>
                        <div className="edit-section-title">
                            My Stores
                        </div>
                        <div>
                            {stores && stores.map((store, index) => {
                                return (
                                    <div key={store._id.toString()}>
                                        <div>
                                            {store.name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default Profile;