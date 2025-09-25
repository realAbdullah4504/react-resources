import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const items = [
  { id: 1, category: "Furniture", price: 100, name: "Table" },
  { id: 2, category: "Furniture", price: 200, name: "Chair" },
  { id: 3, category: "Furniture", price: 50, name: "Bed" },
  { id: 4, category: "Toys", price: 20, name: "Car" },
  { id: 5, category: "Toys", price: 50, name: "Doll" },
  { id: 6, category: "Clothing", price: 50, name: "Shirt" },
];
const Filter = () => {
  const [searchParams] = useSearchParams();
  const [filteredItems, setFilteredItems] = useState([]);
  const category = searchParams.get("category");
  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items/${category}`
      );
      const data = await response.json();
      setFilteredItems(data.items);
    };
    fetchItems();
  }, [category]);
  return (
    <div>
      <h2>Filter</h2>
      <p>Category: {category}</p>
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Filter;
