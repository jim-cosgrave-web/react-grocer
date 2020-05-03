import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import axios from 'axios';
import env from '../Shared/Environment';

const Login = (props) => {
    const refUsername = React.createRef();
    const refPassword = React.createRef();
    const history = useHistory();

    useEffect(() => {
        if(localStorage.getItem("token")) {
            history.push('/list');
        }
    }, []);

    const handleLoginClick = () => {
        const userName = refUsername.current.value;
        const password = refPassword.current.value;
        const body = { username: userName, password: password };

        axios.post(env.apiPrefix + 'users', body).then((res) => {
            const response = res.data;

            if(response.unauthorized) {
                console.log('Unauthorized');
            }

            localStorage.setItem('token', response.token);
            localStorage.setItem('user_id', response.user_id);
            history.push('/list');
        });
    }

    const handleKeyUp = (event) => {
        if (event.key === 'Enter') {
            handleLoginClick();
        }
    }

    let content = (
        <div className="container">
            <div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png" 
                     alt="Logo" 
                     style={{marginBottom: '10px', width: '250px'}}
                     >
                        
                </img>
                <br />
                <input ref={refUsername} placeholder="Username" style={{fontSize: '20px', marginBottom: '10px', padding: '.2em', width: '100%'}}></input>
                <br />
                <input ref={refPassword} onKeyUp={handleKeyUp} placeholder="Password" type="password" style={{fontSize: '20px', marginBottom: '10px', padding: '.2em', width: '100%'}}></input>
                <br />
                <div onClick={handleLoginClick} className="g-btn" style={{fontSize: '20px', marginBottom: '10px', padding: '.2em'}}>Login</div>
            </div>
        </div>
    );

    return content;
}

export default Login;