import { useQuery } from "@tanstack/react-query";
import { apiHandler } from "../../lib/handler";
import type { Category } from "../../types/category";

export const useSelectedCategory = () => {
  const { data: selectedCategory, isLoading, error } = useQuery({
    queryKey: ["selectedCategory"],
    queryFn: () =>
      apiHandler<Category>(
        `${import.meta.env.VITE_API_URL}/selectedCategory`
      ),
  });
  return {
    selectedCategory,
    isLoading,
    error,
  };
};
