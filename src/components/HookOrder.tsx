import { useState } from "react";

export function Example() {
  const [a] = useState("A");
  const [b] = useState("B");

  if (Math.random() > 0.5) {
    const [c] = useState("C");
  }

  const [d] = useState("D");
  console.log("checking d",d)
}