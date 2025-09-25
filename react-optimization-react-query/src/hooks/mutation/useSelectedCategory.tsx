import { useMutation } from "@tanstack/react-query";
import { apiHandler } from "../../lib/handler";
import { queryClient } from "../../lib/queryClient";

const useSelectedCategory = () => {
  const selectCategoryMutation = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      apiHandler(`${import.meta.env.VITE_API_URL}/selectedButton`, {
        method: "POST",
        body: JSON.stringify({ id: id }),
      }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["selectedButton"],
      });
      queryClient.setQueryData(["selectedButton"], id);
      const previousData = queryClient.getQueryData(["selectedButton"]);
      return { previousData };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["selectedButton"], context?.previousData);
    },
  });
  return {
    selectCategory: selectCategoryMutation.mutate,

    isLoading: selectCategoryMutation.isPending,
    isError: selectCategoryMutation.isError,
    error: selectCategoryMutation.error,
  };
};

export default useSelectedCategory;
