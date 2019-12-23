import React from 'react';
import axios from 'axios';

export default class TestComponent extends React.Component {
    state = {
        values: []
    }

    componentDidMount() {
        axios.get('http://localhost:2584/api/Grocery')
          .then(res => {
             const values = res.data;
             console.log(res);
             this.setState({ values });
          }).catch(res => {
            console.error(res); 
          }).finally(() => {
            console.log('Done!');
          });
      }

    render() {
        return (
            <ul>

            </ul>
        );
    }
}
