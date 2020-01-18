import React from 'react';

function StoreCategory({ category, onMove }) {
    const moveLeft = () => {
        onMove(category, -1);
    }

    const moveRight = () => {
        onMove(category, 1);
    }

    return (
        <div className="card grocery-category-card">
            <div className="card-header flex-grid">
                <div>
                    { category.name } 
                </div>
                <div>
                    <button onClick={moveLeft}>Left</button>
                    <button onClick={moveRight}>Right</button>
                </div>
            </div>
            <div className="card-body">
                
            </div>
        </div>
    )
}

export default StoreCategory;