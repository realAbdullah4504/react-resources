import { useQuery } from "@tanstack/react-query";
import { apiHandler } from "../../lib/handler";

export const useCategories = () => {
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await apiHandler(`${import.meta.env.VITE_API_URL}/category`);
      return data.data;
    },
  });
  return categories;
};
