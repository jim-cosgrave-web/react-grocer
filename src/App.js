import React, { useEffect, useState } from 'react';

import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.min.css';

import Login from './components/Authentication/Login';
import Menu from './components/Menu/Menu';

import GroceryList from './components/GroceryList/GroceryList';
import StoreGroceryList from './components/GroceryList/StoreGroceryList/StoreGroceryList';

import Admin from './components/Admin/Admin';
import StoreDetails from './components/Store/StoreDetails/StoreDetails';
import AddEditStore from './components/Admin/AddEditStore';

import Recipes from './components/Recipes/Recipes';
import Recipe from './components/Recipes/Recipe';
import AddEditRecipe from './components/Recipes/AddEditRecipe';

import Profile from './components/User/Profile';

import DebugComponent from './components/Debug/Debug';

import axios from 'axios';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  const [configured, setConfigured] = useState(false);

  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  });

  useEffect(() => {
    setConfigured(true);
  }, []);

  return (
    <Router>
      <div className="wrapper">
        {configured && <Menu></Menu>}
        <div className="h-100 app-body">
          <Switch>
            <Route path="/admin/store/:id">
              <StoreDetails></StoreDetails>
            </Route>
            <Route path="/admin/edit/:storeId">
              <AddEditStore></AddEditStore>
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
            <Route path="/recipes/edit/:recipeId">
              <AddEditRecipe></AddEditRecipe>
            </Route>
            <Route path="/recipes/:recipeId">
              <Recipe></Recipe>
            </Route>
            <Route path="/recipes">
              <Recipes></Recipes>
            </Route>
            <Route path="/profile">
              <Profile></Profile>
            </Route>
            <Route path="/">
              <Login></Login>
            </Route>
          </Switch>
        </div>
        <DebugComponent></DebugComponent>
      </div>
    </Router>
  );
}

export default App;
