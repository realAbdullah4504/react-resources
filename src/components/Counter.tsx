import { useState } from "react";

export function Counter() {
    const [count, setCount] = useState(0);

    function handleLog() {
        setTimeout(() => {
            console.log(count);
        }, 3000);
    }

    function increment() {
        setCount(count + 1);
    }

    return (
        <>
            <button onClick={increment}>+</button>
            <button onClick={handleLog}>Log</button>
        </>
    );
}