import { useQuery } from "@tanstack/react-query";
import { apiHandler } from "../../lib/handler";

export const useSelectedCategory = () => {
  const selectedCategory = useQuery({
    queryKey: ["selectedCategory"],
    queryFn: () =>
      apiHandler(`${import.meta.env.VITE_API_URL}/selectedCategory`),
  });
  return selectedCategory;
};
