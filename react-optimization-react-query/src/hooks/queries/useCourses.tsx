import { useQuery } from "@tanstack/react-query";
import type { Course } from "../../types/courses";
import { apiHandler } from "../../lib/handler";

export const useCourses = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: () =>
      apiHandler<Course[]>(`${import.meta.env.VITE_API_URL}/courses`),
  });
  return { data, isLoading, error };
};
