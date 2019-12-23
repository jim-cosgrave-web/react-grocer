import React from 'react';
import logo from './logo.svg';
import './App.scss';
import TestComponent from './components/test/testComponent';
import Menu from './components/Menu/Menu';
import GroceryList from './components/GroceryList/GroceryList';
import Admin from './components/Admin/Admin';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {

  return (
    <Router>
      <div>
        <Menu></Menu>
        <div style={{padding: '1rem'}}>
          <Switch>
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
