import { useMutation } from "@tanstack/react-query";
import type { Course } from "../../types/courses";
import { apiHandler } from "../../lib/handler";
import { queryClient } from "../../lib/queryClient";

export const useSelectCourseMutation = () => {
  const mutation = useMutation({
    mutationFn: (course: Course) => {
      return apiHandler<Course[], string>(
        `${import.meta.env.VITE_API_URL}/selectCourses`,
        {
          method: "POST",
          body: JSON.stringify({ course }),
        }
      );
    },
    onMutate: async (course: Course) => {
      await queryClient.cancelQueries({ queryKey: ["selectedCourses"] });
      const previousData = queryClient.getQueryData(["selectedCourses"]);
      queryClient.setQueryData(
        ["selectedCourses"],
        (prevData: Course[] | undefined) => {
          const isSelectedCourse = prevData?.some((c) => c.id === course.id);
          if (prevData) {
            if (isSelectedCourse) {
              return prevData?.filter((c) => c.id !== course.id);
            }
            return [...prevData, course];
          }
          return [course];
        }
      );
      return { previousData };
    },
    onError: (error, variables, context) => {
      // queryClient.setQueryData(["selectedCourses"], context?.previousData);
    },
  });
  return {
    selectCourses: mutation.mutate,
    isSelecting: mutation.isPending,
    selectError: mutation.error,
    isError: mutation.isError,
  };
};
