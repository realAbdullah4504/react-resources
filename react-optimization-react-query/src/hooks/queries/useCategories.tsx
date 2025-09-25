import { useQuery } from "@tanstack/react-query";
import { apiHandler } from "../../lib/handler";
import type { Category } from "../../types/category";

export const useCategories = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      apiHandler<Category[]>(`${import.meta.env.VITE_API_URL}/category`),
  });
  return {
    categories,
    isLoading,
    error,
  };
};
