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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const [optimisticSelectedCategoryId, setOptimisticSelectedCategoryId] =
    useOptimistic(selectedCategoryId);

  useEffect(() => {
    const fetchButtons = async () => {
      const { data } = await apiHandler<{ id: number; name: string }[]>(
        `${import.meta.env.VITE_API_URL}/category`
      );
      const { data: selectedCategory } =
        await apiHandler<{ id: number; name: string }>(
          `${import.meta.env.VITE_API_URL}/selectedCategory`
        );
      setCategory(data || []);
      setSelectedCategoryId(selectedCategory?.id || null);
    };
    fetchButtons().catch((error) => {
      console.error("Error fetching buttons:", error);
    });
  }, []);

  const handleSelect = async (category: { id: number; name: string }) => {
    console.log("1. Starting outer transition");
    // startTransition(async () => {
      setOptimisticSelectedCategoryId(category.id);
      console.log("2. Making API call");
      const { data } = await apiHandler<{ id: number; name: string }, string >(
        `${import.meta.env.VITE_API_URL}/selectedCategory`,
        {
          method: "POST",
          body: JSON.stringify({ category }) ,
        }
      );
      // startTransition(() => {
        console.log("3. Updating UI");
        setSearchParams({ category: data?.name || "" });
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
