import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Login from './components/Authentication/Login';
import Menu from './components/Menu/Menu';
import GroceryList from './components/GroceryList/GroceryList';
import StoreGroceryList from './components/GroceryList/StoreGroceryList/StoreGroceryList';
import Admin from './components/Admin/Admin';
import StoreDetails from './components/Store/StoreDetails/StoreDetails';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import HooksTest from './components/HooksTest';
function App() {

  return (
    <Router>
      <div className="h-100">
        <Menu></Menu>
        <div className="h-100" style={{padding: '.5rem'}}>
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
              <GroceryList></GroceryList>
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
