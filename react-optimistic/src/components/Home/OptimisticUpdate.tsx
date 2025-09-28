import React, {
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import Button from "./Button";
import { useSearchParams } from "react-router-dom";
import { apiHandler } from "../../lib/handler";

const OptimisticUpdate = () => {
  const [, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const [optimisticSelectedCategoryId, setOptimisticSelectedCategoryId] =
    useOptimistic<number | null>(selectedCategoryId);

  useEffect(() => {
    const fetchButtons = async () => {
      const { data } = await apiHandler<{ id: number; name: string }[]>(
        `${import.meta.env.VITE_API_URL}/category`
      );
      const { data: selectedCategory } = await apiHandler<{
        id: number;
        name: string;
      }>(`${import.meta.env.VITE_API_URL}/selectedCategory`);
      setCategory(data || []);
      setSelectedCategoryId(selectedCategory?.id || null);
    };
    fetchButtons().catch((error) => {
      console.error("Error fetching buttons:", error);
    });
  }, []);

  const apiCount = useRef(0);
  const handleSelect = (category: { id: number; name: string }) => {
    if(optimisticSelectedCategoryId === category.id) return;
    const current = ++apiCount.current;
    startTransition(async () => {
      setOptimisticSelectedCategoryId(category.id);
      console.log(current, apiCount.current);
      try {
        console.log("2. Making API call");
        const { data } = await apiHandler<{ id: number; name: string }, string>(
          `${import.meta.env.VITE_API_URL}/selectedCategory`,
          {
            method: "POST",
            body: JSON.stringify({ category }),
          }
        );
        if (current === apiCount.current) {
          startTransition(() => {
            setSelectedCategoryId(category.id);
            setSearchParams({ category: data?.name || "" });
          });
        }
      } catch (error) {
        console.log("Error updating UI", error);
      }
    });
  };
  return (
    <div>
      <p>{isPending ? "Loading..." : "Loaded"}</p>
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
