const Button = ({
  category,
  handleSelect,
  selectedCategory,
}: {
  category: { id: number; name: string };
  handleSelect: (category: { id: number; name: string }) => void;
  selectedCategory: boolean;
}) => {

  return (
    <button
    className="p-2 m-2 w-24 rounded card text-white"
      onClick={() => {
        handleSelect(category);
      }}
      key={category.id}
      style={{ backgroundColor: selectedCategory ? "blue" : "black" }}
    >
      {category.name}
    </button>
  );
};

export default Button;
