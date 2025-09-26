import { useMutation } from "@tanstack/react-query";
import { apiHandler } from "../../lib/handler";
import { queryClient } from "../../lib/queryClient";
import type { Category } from "../../types/category";

export const useSelectedCategoryMutation = () => {
  const selectCategoryMutation = useMutation({
    mutationFn: (category: Category) =>
      apiHandler<Category, string>(
        `${import.meta.env.VITE_API_URL}/selectedCategory`,
        {
          method: "POST",
          body: JSON.stringify({ category }),
        }
      ),
    onMutate: async (category) => {
      await queryClient.cancelQueries({
        queryKey: ["selectedCategory"],
      });
      queryClient.setQueryData(["selectedCategory"], category);
      const previousData = queryClient.getQueryData(["selectedCategory"]);
      return { previousData };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["selectedCategory"], context?.previousData);
    },
  });
  return {
    selectCategory: selectCategoryMutation.mutate,

    isLoading: selectCategoryMutation.isPending,
    isError: selectCategoryMutation.isError,
    error: selectCategoryMutation.error,
  };
};
