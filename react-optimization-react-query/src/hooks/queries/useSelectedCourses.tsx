import { useQuery } from "@tanstack/react-query";
import type { Course } from "../../types/courses";
import { apiHandler } from "../../lib/handler";
export const useSelectedCourses = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["selectedCourses"],
    queryFn: () =>
      apiHandler<Course[]>(
        `${import.meta.env.VITE_API_URL}/selectedCourses`
      ),
  });
  return { data, isLoading, error };
};
