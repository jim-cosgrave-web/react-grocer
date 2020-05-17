import React, { useEffect, useState } from 'react';

import { useInterval } from '../../hooks/useInterval';

const DebugComponent = (props) => {
    const [debug, setDebug] = useState(null)

    const getDebug = () => {
        let ls = JSON.parse(localStorage.getItem('DEBUG'));

        if (!ls) {
            ls = {};
        }

        console.log(ls.errors);

        setDebug(ls);
    }

    useEffect(() => {
        getDebug();
    }, []);

    useInterval(() => {
        getDebug();
    }, 5000);

    let content = (
        <div>
            DEBUGGER!
            <ul>
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