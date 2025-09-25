import { useSelectedCategoryMutation } from "../../hooks/mutation/useSelectedCategory";
import { useCategories, useSelectedCategory } from "../../hooks/queries";
import Button from "./Button";
import { useSearchParams } from "react-router-dom";
import type { Category } from "../../types/category";

const OptimisticUpdate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategories();
  const { selectCategory } = useSelectedCategoryMutation();

  const { selectedCategory } = useSelectedCategory();


  const handleSelect = async (category: Category) => {
    selectCategory(category, {
      onSuccess: () => {
        setSearchParams({ category: category.name });
      },
    });
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
        {categories?.map((category: Category) => (
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
