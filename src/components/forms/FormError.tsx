
type FormErrorProps = {
  message: string;
  type?: string;
};

export function FormError({ message, type = "error" }: FormErrorProps) {
  if (!message) return null;

  return (
    <p
      role="alert"
      aria-live="polite"
      className={`${type === "error" ? "error" : "success"}`}
    >
      {message}
    </p>
  );
}