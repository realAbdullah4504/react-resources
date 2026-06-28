import { useRef, useState } from "react";

export function Counter() {
    const [count, setCount] = useState<number>(0);
    const latest = useRef(count);

    latest.current = count;

    function handleClick() {
        setTimeout(() => {
            console.log(count);
            console.log(latest.current);
        }, 3000);
    }

    return (
        <button
            onClick={() => {
                handleClick();
                setCount(1);
            }}
        >
            Click
        </button>
    );
}