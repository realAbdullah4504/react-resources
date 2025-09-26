import React, {
  startTransition,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import Button from "./Button";
import { useSearchParams } from "react-router-dom";
import { apiHandler } from "../../lib/handler";

const OptimisticUpdate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticSelectedCategoryId, setOptimisticSelectedCategoryId] =
    useOptimistic(selectedCategoryId);

  useEffect(() => {
    const fetchButtons = async () => {
      const {data, error} = await apiHandler(`${import.meta.env.VITE_API_URL}/category`);
      const {data: selectedCategory, error: selectedCategoryError} = await apiHandler(`${import.meta.env.VITE_API_URL}/selectedCategory`);
      setCategory(data);
      setSelectedCategoryId(selectedCategory.id);
    };
    fetchButtons();
  }, []);

  const handleSelect = async (category: { id: number; name: string }) => {
    console.log("1. Starting outer transition");
    // startTransition(async () => {
    // setOptimisticSelectedButtonId(button.id);
    console.log("2. Making API call");
    setSelectedCategoryId(category.id);
    const {data, error} = await apiHandler(
      `${import.meta.env.VITE_API_URL}/selectedCategory`,
      {
        method: "POST",
        body: JSON.stringify({ category }),
      }
    );
    // startTransition(() => {
    console.log("3. Updating UI");
    setSearchParams({ category: data.name }); 
    // });
    console.log("4. Inner transition scheduled");
    // });
    console.log("5. After outer transition");
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {category?.map((category) => (
          <Button
            key={category.id}
            category={category}
            handleSelect={handleSelect}
            selectedCategory={category.id === optimisticSelectedCategoryId}
          />
        ))}
      </div>
    </div>
  );
};

export default OptimisticUpdate;
