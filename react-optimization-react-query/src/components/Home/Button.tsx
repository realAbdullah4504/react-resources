import type { Category } from "../../types/category";

const Button = ({
  category,
  handleSelect,
  selectedButton,
}: {
  category: Category;
  handleSelect: (category: Category) => void;
  selectedButton: boolean;
}) => {
  return (
    <button
      className="p-2 m-2 w-24 rounded card text-white"
      onClick={() => {
        handleSelect(category);
      }}
      key={category.id}
      style={{ backgroundColor: selectedButton ? "blue" : "black" }}
    >
      {category.name}
    </button>
  );
};

export default Button;
