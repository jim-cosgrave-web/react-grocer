import React, { useEffect, useState } from 'react';
import './App.scss';
import Login from './components/Authentication/Login';
import Menu from './components/Menu/Menu';
import GroceryList from './components/GroceryList/GroceryList';
import StoreGroceryList from './components/GroceryList/StoreGroceryList/StoreGroceryList';
import Admin from './components/Admin/Admin';
import StoreDetails from './components/Store/StoreDetails/StoreDetails';
import axios from 'axios';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  const [configured, setConfigured] = useState(false);

  useEffect(() => {

    axios.interceptors.request.use(function (config) {
      const token = localStorage.getItem('token');
      config.headers.Authorization = `Bearer ${token}`;     

      return config;
    });

    setTimeout(() => {
      setConfigured(true);
    }, 1000);
    
  }, []);

  return (
    <Router>
      <div className="h-100">
        {configured && <Menu></Menu>}
        <div className="h-100" style={{ padding: '.5rem' }}>
          <Switch>
            <Route path="/admin/store/:id">
              <StoreDetails></StoreDetails>
            </Route>
            <Route path="/admin">
              <Admin></Admin>
            </Route>
            <Route path="/shop/:listId">
              <StoreGroceryList></StoreGroceryList>
            </Route>
            <Route path="/list">
              {configured && <GroceryList></GroceryList>}
            </Route>
            <Route path="/">
              <Login></Login>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
