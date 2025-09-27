import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiHandler } from "../../lib/handler";
import { Item } from "../../types/items";

const Filter = () => {
  const [searchParams] = useSearchParams();
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const category = searchParams.get("category") as string;
  useEffect(() => {
    const fetchItems = async () => {
      const { data,error } = await apiHandler<{ items: Item[] }>(
        `${import.meta.env.VITE_API_URL}/items/${category}`
      );
      if(error){
        console.log(error)
      }
      setFilteredItems(data?.items || []);
    };
    void fetchItems();
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
