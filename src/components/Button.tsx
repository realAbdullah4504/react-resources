const Button = ({
  button,
  handleSelect,
  selectedButton,
}: {
  button: { id: number; name: string };
  handleSelect: (button: { id: number; name: string }) => void;
  selectedButton: boolean;
}) => {

  return (
    <button
      onClick={() => {
        handleSelect(button);
      }}
      key={button.id}
      style={{ backgroundColor: selectedButton ? "blue" : "black" }}
    >
      {button.name}
    </button>
  );
};

export default Button;
