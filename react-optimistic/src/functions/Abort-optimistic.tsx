const [searchParams, setSearchParams] = useSearchParams();
const [selectedButtonId, setSelectedButtonId] = React.useState<number | null>(
  null
);
const lateReqRef = React.useRef<number>(0);
const abortControllerRef = React.useRef<AbortController | null>(null);

const handleSelect = async (button: { id: number; name: string }) => {
const previousSelected = selectedButtonId;
const previousCategory = searchParams.get("category");

// Cancel any existing request
if (abortControllerRef.current) {
  abortControllerRef.current.abort();
}

// Create a new AbortController for this request
const controller = new AbortController();
abortControllerRef.current = controller;

const currentReq = ++lateReqRef.current;

try {
  setSelectedButtonId(button.id);
  setSearchParams({ category: button.name });

  // Example: replace with real API
  await fetch("https://jsonplaceholder.typicode.com/photos", { signal: controller.signal });

  if (currentReq === lateReqRef.current) {
    console.log("✅ Latest request finished");
  }
} catch (err: any) {
  if (err.name === "AbortError") {
    console.log("⚠️ Request cancelled");
    return;
  }

  if (currentReq === lateReqRef.current) {
    // Rollback if it's the latest request that failed
    setSelectedButtonId(previousSelected);
    setSearchParams({ category: previousCategory || "" });
    console.log("❌ Failed to update button");
  }
}
};