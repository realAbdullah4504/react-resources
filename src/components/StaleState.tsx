import { useState } from "react";

export default function StaleState() {
  const [isExpanded, setIsExpanded] = useState(false);

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // ❌ Problematic with async + captured state
  const badToggle = async () => {
    console.log("BAD: started, isExpanded =", isExpanded);

    await wait(1000);

    // isExpanded is the value captured when this handler started
    setIsExpanded(!isExpanded);

    console.log("BAD: setting to", !isExpanded);
  };

  // ✅ Correct when next state depends on previous state
  const goodToggle = async () => {
    console.log("GOOD: started");

    await wait(1000);

    setIsExpanded((prev) => {
      console.log("GOOD: React gave us latest state =", prev);

      return !prev;
    });
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>
        Expanded: {isExpanded ? "YES" : "NO"}
      </h2>

      <button onClick={badToggle}>
        Bad Toggle
      </button>

      <button
        onClick={goodToggle}
        style={{ marginLeft: 10 }}
      >
        Good Toggle
      </button>
    </div>
  );
}