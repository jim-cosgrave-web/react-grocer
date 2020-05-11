import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../Shared/Environment';

import { useHistory } from "react-router-dom";

function AddEditRecipe() {
    const nameInputRef = React.createRef();
    const cityInputRef = React.createRef();
    const stateInputRef = React.createRef();
    const latitudeInputRef = React.createRef();
    const longitudeInputRef = React.createRef();

    const history = useHistory();

    useEffect(() => {
    }, []);

    const save = () => {
        const body = {
            name: nameInputRef.current.value,
            city: cityInputRef.current.value,
            state: stateInputRef.current.value,
            latitude: latitudeInputRef.current.value,
            longitude: longitudeInputRef.current.value
        }

        axios.post(env.apiPrefix + 'stores', body).then(res => {
            history.push('/admin');
        });
    }

    return (
        <div className="create-store-wrapper">
            <h2>Create a Store</h2>
            <div>
                <div className="mt-10">
                    <h5>Name</h5>
                    <input type="text" ref={nameInputRef}></input>
                </div>
                <div className="mt-10">
                    <h5>City</h5>
                    <input type="text" ref={cityInputRef}></input>
                </div>
                <div className="mt-10">
                    <h5>State</h5>
                    <input type="text" ref={stateInputRef}></input>
                </div>
                <div className="mt-10">
                    <h5>Latitude</h5>
                    <input type="text" ref={latitudeInputRef}></input>
                </div>       
                <div className="mt-10">
                    <h5>Longitude</h5>
                    <input type="text" ref={longitudeInputRef}></input>
                </div>                         
            </div>
            <div onClick={save} className="mt-15 g-btn g-btn-large btn-warning bold noselect">Save</div>
        </div>
    );
}

export default AddEditRecipe;