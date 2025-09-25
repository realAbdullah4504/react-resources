const Button = ({
  category,
  handleSelect,
  selectedButton,
}: {
  category: { id: number; name: string };
  handleSelect: (category: { id: number; name: string }) => void;
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
