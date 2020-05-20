import React, { useEffect, useState } from 'react';

import { useInterval } from '../../hooks/useInterval';

const DebugComponent = (props) => {
    const [debug, setDebug] = useState(null)

    const getDebug = () => {
        let ls = JSON.parse(localStorage.getItem('DEBUG'));

        if (!ls) {
            ls = { errors: [] };
        }

        setDebug(ls);
    }

    useEffect(() => {
        getDebug();
    }, []);

    useInterval(() => {
        getDebug();
    }, 5000);

    const handleClearAllClick = () => {
        let ls = JSON.parse(localStorage.getItem('DEBUG'));
        ls.errors = [];
        localStorage.setItem('DEBUG', JSON.stringify(ls));

        setDebug(ls);
    }

    let content = (
        <div>
            DEBUGGER!
            <div>
                <button onClick={handleClearAllClick}>Clear All</button>
            </div>
            <ul style={{ "maxWidth": "100%", "wordBreak": "break-all" }}>
            {debug && debug.errors && debug.errors.map((d, index) => {
                return (
                    <li key={index} >
                        {d.event} {d.error.message} {d.timestamp}
                    </li>
                );
            })}
            </ul>
        </div>
    )

    return content;
}

export default DebugComponent;