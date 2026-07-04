import React, { useTransition, useState } from "react";

const Transition = () => {
    console.log("rendering Transition");
    const [isPending, startTransition] = useTransition();
    const [list, setList] = useState(
        Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`)
    );
    const [filter, setFilter] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(value);
        startTransition(() => {
            const filtered = list.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setList(filtered);
        });
    };

    return (
        <div style={{ padding: "20px" }}>
            <h3>useTransition Example</h3>
            <p>Type below to filter 10,000 items. The UI stays responsive during filtering.</p>
            <input
                type="text"
                placeholder="Search items..."
                value={filter}
                onChange={handleChange}
                style={{ padding: "8px", width: "300px" }}
            />
            {isPending && <p style={{ color: "orange" }}>Filtering...</p>}
            <ul style={{ maxHeight: "200px", overflow: "auto", marginTop: "10px" }}>
                {list.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default Transition;
