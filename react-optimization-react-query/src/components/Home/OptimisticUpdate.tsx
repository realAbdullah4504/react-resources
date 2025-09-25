import { useSelectedCategoryMutation } from "../../hooks/mutation/useSelectedCategory";
import { useCategories, useSelectedCategory } from "../../hooks/queries";
import Button from "./Button";
import { useSearchParams } from "react-router-dom";

const OptimisticUpdate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories } = useCategories();
  const { selectCategory } = useSelectedCategoryMutation();

  const { data: selectedCategory } = useSelectedCategory();
  console.log("selectedCategory", selectedCategory);

  const handleSelect = async (category: { id: number; name: string }) => {
    console.log("1. Starting outer transition");
    console.log("2. Making API call");
    selectCategory(category, {
      onSuccess: () => {
        console.log("3. Updating UI");
        setSearchParams({ category: category.name });
      },
    });
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
            selectedButton={category.id === selectedCategory?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default OptimisticUpdate;
