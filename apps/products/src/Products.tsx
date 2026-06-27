import { useEffect, useCallback } from "react";

export default function Products() {
  const handleTabClick = useCallback((event: Event) => {
    event.stopPropagation();
    console.log("Selected tab clicked!");
  }, []);

  useEffect(() => {
    const attachListener = (button: HTMLButtonElement | null) => {
      if (!button) return;

      // Remove previous listener if exists (in case same button is re-selected)
      button.removeEventListener("click", handleTabClick);
      button.addEventListener("click", handleTabClick);
    };

    // Initial attachment
    const initialSelected = document.querySelector<HTMLButtonElement>(
      '[role="tab"][aria-selected="true"]'
    );
    attachListener(initialSelected);



    return () => {
      // Clean up current listener
      const currentSelected = document.querySelector<HTMLButtonElement>(
        '[role="tab"][aria-selected="true"]'
      );
      currentSelected?.removeEventListener("click", handleTabClick);
    };
  }, [handleTabClick]);

  return (
    <div>
      <h2>Products App great people</h2>
    </div>
  );
}