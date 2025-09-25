import { useQuery } from "@tanstack/react-query";
import { apiHandler } from "../../lib/handler";
import type { ItemResponse } from "../../types/items";


export const useItems = (category?: string) => {
  const { data: items } = useQuery({
    queryKey: ["items", category],
    queryFn: async () => {
      const data = await apiHandler<ItemResponse>(
        `${import.meta.env.VITE_API_URL}/items/${category}`
      );
      return data.items;
    },
    enabled: !!category,
  });
  return items;
};
