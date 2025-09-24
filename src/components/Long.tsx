import React, { useState } from "react";

const LongList = () => {
  const [items, setItems] = useState(
    Array.from({ length: 500 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))
  );
  const [loading, setLoading] = useState(false);

  const handleClear = async () => {
    setLoading(true);

    // Simulate heavy async work
    await new Promise((res) => setTimeout(res, 2000));

    // This will block the UI because React has to re-render 5000 elements
    setItems([]);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleClear} disabled={loading}>
        {loading ? "Clearing..." : "Clear List"}
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ padding: "4px 0" }}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LongList;
