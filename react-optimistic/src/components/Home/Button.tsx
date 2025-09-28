const Button = ({
  category,
  handleSelect,
  selectedCategory,
}: {
  category: { id: number; name: string };
  handleSelect: (category: { id: number; name: string }) => Promise<void>;
  selectedCategory: boolean;
}) => {
  const handleClick = async (category: { id: number; name: string }) => {
    await handleSelect(category);
  };
  return (
    <button
      className="p-2 m-2 w-24 rounded card text-white"
      onClick={() => void handleClick(category)}
      key={category.id}
      style={{ backgroundColor: selectedCategory ? "blue" : "black" }}
    >
      {category.name}
    </button>
  );
};

export default Button;
