import React, { useOptimistic, useTransition } from "react";
import Button from "./Button";

const buttons = [
  { id: 1, name: "Button 1" },
  { id: 2, name: "Button 2" },
  { id: 3, name: "Button 3" },
];
const OptimisticUpdate = () => {
  const [selectedButtonId, setSelectedButtonId] = React.useState<number | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const [optimisticButtonId, setOptimisticButtonId] = useOptimistic(
    selectedButtonId,
    (_current, newId: number | null) => newId
  );
  const handleSelect = (button: { id: number; name: string }) => {
    console.log(button);
    startTransition(async () => {
      try {
        setOptimisticButtonId(button.id);
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
        startTransition(() => {
          setSelectedButtonId(button.id);
        });
      } catch {
        console.log("Failed to update button");
      }
    });
  };

  return (
    <div>
      <h1>OptimisticUpdate</h1>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {buttons.map((button) => (
          <Button
            key={button.id}
            button={button}
            handleSelect={handleSelect}
            selectedButton={button.id === optimisticButtonId}
          />
        ))}
      </div>
    </div>
  );
};

export default OptimisticUpdate;
