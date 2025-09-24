import React, { useState } from "react";

const BulkDelete = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Cherry" },
  ]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 2000)); // fake API
    setItems((prev) => prev.filter((i) => !selected.includes(i.id)));
    setSelected([]);
    setLoading(false);
  };

  return (
    <div>
      {items.map((item) => (
        <label key={item.id} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selected.includes(item.id)}
            onChange={() => toggleSelect(item.id)}
          />
          {item.name}
        </label>
      ))}
      <button onClick={handleDelete} disabled={loading || selected.length === 0}>
        {loading ? "Deleting..." : "Delete Selected"}
      </button>
    </div>
  );
};

export default BulkDelete;
