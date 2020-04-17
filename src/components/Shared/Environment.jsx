const env = {};

if(process.env.NODE_ENV === 'production') {
    env.apiPrefix = 'https://grocery-api.now.sh/';
} else {
    env.apiPrefix = 'http://localhost:3100/';
}


export default env;