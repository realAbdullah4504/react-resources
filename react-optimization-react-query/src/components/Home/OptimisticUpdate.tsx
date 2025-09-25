import React, {
  startTransition,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import Button from "./Button";
import { useSearchParams } from "react-router-dom";
import { apiHandler } from "../../../../react-optimization-react-query/src/lib/handler";

const OptimisticUpdate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [buttons, setButtons] = useState<{ id: number; name: string }[]>([]);
  const [selectedButtonId, setSelectedButtonId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticSelectedButtonId, setOptimisticSelectedButtonId] =
    useOptimistic(selectedButtonId);

  useEffect(() => {
    const fetchButtons = async () => {
      const data = await apiHandler(`${import.meta.env.VITE_API_URL}/category`);
      const selectedButton = await apiHandler(
        `${import.meta.env.VITE_API_URL}/selectedButton`
      );
      setButtons(data.data);
      setSelectedButtonId(selectedButton.data);
    };
    fetchButtons();
  }, []);

  const handleSelect = async (button: { id: number; name: string }) => {
    console.log("1. Starting outer transition");
    startTransition(async () => {
      setOptimisticSelectedButtonId(button.id);
      console.log("2. Making API call");
      const { data, error } = await apiHandler(
        `${import.meta.env.VITE_API_URL}/selectedButton`,
        {
          method: "POST",
          body: JSON.stringify({ id: button.id }),
        }
      );
      startTransition(() => {
        console.log("3. Updating UI");
        setSelectedButtonId(data.id);
        setSearchParams({ category: data.name });
      });
      console.log("4. Inner transition scheduled");
    });
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
        {buttons?.map((button) => (
          <Button
            key={button.id}
            button={button}
            handleSelect={handleSelect}
            selectedButton={button.id === optimisticSelectedButtonId}
          />
        ))}
      </div>
    </div>
  );
};

export default OptimisticUpdate;
