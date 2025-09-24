import React, { useState, useTransition } from "react";

const Button = ({
  button,
  handleSelect,
  selectedButton,
}: {
  button: { id: number; name: string };
  handleSelect: (button: { id: number; name: string }) => void;
  selectedButton: boolean;
}) => {
  const [color, setColor] = useState("black");
  const [isPending, startTransition] = useTransition();
  // const handleClick = async () => {
  //   const prevColor = color;
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     startTransition(() => {
  //       setColor("blue");
  //     });
  //   } catch {
  //     setColor(prevColor);
  //   }
  // };

  return (
    <button
      onClick={() => handleSelect(button)}
      key={button.id}
      style={{ backgroundColor: selectedButton ? "blue" : "black" }}
    >
      {button.name}
    </button>
  );
};

export default Button;
