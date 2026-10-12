import { useState } from "react";
import { FormError } from "./FormError";

export function EmployeeForm() {
  const [error, setError] = useState<{ message: string } | null>(null);

  return (
    <div>
      <button type="button" onClick={() => setError({ message: "Error occurred" })}>
        Click me
      </button>
      {error && <FormError message={error.message} type="error" />}
    </div>
  );
}
