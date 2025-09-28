import React, {
  useTransition,
  useState,
  useEffect,
  useOptimistic,
} from "react";
import { apiHandler } from "../lib/handler";
const MultiSelect = () => {
  //use transition batches the update,like the filtering and api calls etc
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<
    { id: number; name: string }[]
  >([]);

  const [isPending, startTransition] = useTransition();
  const [optimisticSelectedCourses, setOptimisticSelectedCourses] =
    useOptimistic(
      selectedCourses,
      (state, action: { id: number; name: string }) => {
        const isSelected = state.some((c) => c.id === action.id);
        if (isSelected) {
          return state.filter((c) => c.id !== action.id);
        }
        return [...state, action];
      }
    );

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await apiHandler<{ id: number; name: string }[]>(
        `${import.meta.env.VITE_API_URL}/courses`
      );
      setCourses(data || []);
    };
    const fetchSelectedCourses = async () => {
      const { data } = await apiHandler<{ id: number; name: string }[]>(
        `${import.meta.env.VITE_API_URL}/selectedCourses`
      );
      setSelectedCourses(data || []);
    };
    fetchCourses().catch((error) => {
      console.error("Error fetching courses:", error);
    });
    fetchSelectedCourses().catch((error) => {
      console.error("Error fetching selected courses:", error);
    });
  }, []);

  const handleClick = (course: { id: number; name: string }) => {
    startTransition(async () => {
      setOptimisticSelectedCourses(course);
      try {
        const { data } = await apiHandler<
          { id: number; name: string }[],
          string
        >(`${import.meta.env.VITE_API_URL}/selectCourses`, {
          method: "POST",
          body: JSON.stringify({ course }),
        });
        startTransition(() => {
          setSelectedCourses(data || []);
        });
      } catch (error) {
        console.error("Error fetching buttons:", error);
      }
    });
  };

  return (
    <div>
      <p>{isPending ? "Loading..." : "Loaded"}</p>
      <h1>MultiSelect</h1>
      {courses?.map((course) => (
        <button
          type="button"
          className={`m-2 bg-black text-white p-2 rounded cursor-pointer ${
            optimisticSelectedCourses.some((c) => c.id === course.id)
              ? "bg-blue-500"
              : ""
          }`}
          key={course.id}
          onClick={() => void handleClick(course)}
        >
          {course.name}
        </button>
      ))}
    </div>
  );
};

export default MultiSelect;
