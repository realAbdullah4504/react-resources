import { useSelectCourseMutation } from "../hooks/mutation";
import { useCourses, useSelectedCourses } from "../hooks/queries";
import type { Course } from "../types/courses";
import { queryClient } from "../lib/queryClient";
const MultiSelect = () => {
  const { data: courses, isLoading, error } = useCourses();
  const { data: selectedCourses, isLoading: selectedCoursesLoading } =
    useSelectedCourses();
  const { selectCourses } = useSelectCourseMutation();
  if (isLoading || selectedCoursesLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  const handleClick = (course: Course) => {
    selectCourses(course, {
      onSuccess: (result) => {
        console.log("success");
        queryClient.setQueryData(["selectedCourses"], result);
      },
    });
  };
  return (
    <div>
      <h1>MultiSelect</h1>
      <ul>
        {courses?.map((course) => (
          <button
            type="button"
            className={`m-2 bg-black text-white p-2 rounded cursor-pointer ${
              selectedCourses?.some((c) => c?.id === course?.id)
                ? "bg-blue-500"
                : ""
            }`}
            key={course?.id}
            onClick={() => handleClick(course)}
          >
            {course?.name}
          </button>
        ))}
      </ul>
    </div>
  );
};

export default MultiSelect;
