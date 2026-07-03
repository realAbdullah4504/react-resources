import { useEffect, useRef } from "react";

export const LayoutEffect = () => {
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        console.log(divRef.current);
    }, []);
    return (
        <div>
            <div ref={divRef} style={{ width: 100 }}>
                Hello
            </div>
        </div>
    );
};