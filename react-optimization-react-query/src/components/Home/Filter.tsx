import { useSearchParams } from "react-router-dom";
import { useItems } from "../../hooks/queries/useItems";

const Filter = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const items = useItems(category as string);

  return (
    <div>
      <h2>Filter</h2>
      <p>Category: {category}</p>
      <ul>
        {items?.map((item: { id: number; name: string }) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Filter;
