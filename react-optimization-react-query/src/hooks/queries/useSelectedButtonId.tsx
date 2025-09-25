import { useQuery } from "@tanstack/react-query";
import { apiHandler } from "../../lib/handler";

export const useSelectedButtonId = () => {
  const selectedButtonId = useQuery({
    queryKey: ["selectedButton"],
    queryFn: () => apiHandler(`${import.meta.env.VITE_API_URL}/selectedButton`),
  });
  return selectedButtonId;
};
