import Button from "./Button";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "../../hooks/queries/useCategories";
import useSelectedCategory from "../../hooks/mutation/useSelectedCategory";
import { useSelectedButtonId } from "../../hooks/queries/useSelectedButtonId";

const OptimisticUpdate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories } = useCategories();
  const { selectCategory } = useSelectedCategory();

  const { data: selectedButtonId } = useSelectedButtonId();

  const handleSelect = async (category: { id: number; name: string }) => {
    console.log("1. Starting outer transition");
    console.log("2. Making API call");
    selectCategory(
      { id: category.id },
      {
        onSuccess: () => {
          console.log("3. Updating UI");
          setSearchParams({ category: category.name });
        },
      }
    );
    console.log("4. Inner transition scheduled");
    console.log("5. After outer transition");
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {categories?.map((category: { id: number; name: string }) => (
          <Button
            key={category.id}
            category={category}
            handleSelect={handleSelect}
            selectedButton={category.id === selectedButtonId}
          />
        ))}
      </div>
    </div>
  );
};

export default OptimisticUpdate;
