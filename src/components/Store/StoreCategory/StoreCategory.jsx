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
                    <button onClick={moveLeft}>&lt;&lt;</button>
                    <button onClick={moveRight}>&gt;&gt;</button>
                </div>
            </div>
            <div className="card-body">
                {category.groceries && category.groceries.map((grocery, index) => {
                    return (
                        <div><button>Up</button><button>Down</button>{grocery.groceryName}</div>
                    );
                })}
            </div>
        </div>
    )
}

export default StoreCategory;