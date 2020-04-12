import React from 'react';
import logo from './logo.svg';
import './App.scss';
import TestComponent from './components/test/testComponent';
import Menu from './components/Menu/Menu';
import GroceryList from './components/GroceryList/GroceryList';
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
      <div>
        <Menu></Menu>
        <div style={{padding: '.5rem'}}>
          <Switch>
            <Route path="/admin/store/:id">
              <StoreDetails></StoreDetails>
            </Route>
            <Route path="/admin">
              <Admin></Admin>
            </Route>
            <Route path="/">
              <GroceryList></GroceryList>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
