import axios from 'axios';

function getAuthorizationHeader() {
    const token = localStorage.getItem('token');

    if(!token) {
        return null;
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
}

exports.get = function(url, callback) {
    
}