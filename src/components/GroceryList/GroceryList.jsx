import React, { useState, useEffect } from 'react';
import GrocerySearch from './GrocerySearch/GrocerySearch';

function GroceryList() {
    return (
        <div className="grocery-list">
            <GrocerySearch></GrocerySearch>
        </div>
    );
}

export default GroceryList;