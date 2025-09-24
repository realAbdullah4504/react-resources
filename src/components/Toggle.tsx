import React, { useState } from "react";

const Toggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const prev = enabled;
    setEnabled(!enabled); // optimistic update

    try {
      // fake API call
      await new Promise((res) => setTimeout(res, 2000));
      console.log("Saved to server:", !prev);
    } catch {
      setEnabled(prev); // rollback on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        background: enabled ? "green" : "gray",
        color: "white",
        padding: "10px 20px",
        borderRadius: "20px",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Saving..." : enabled ? "Enabled" : "Disabled"}
    </button>
  );
};

export default Toggle;
