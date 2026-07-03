import { useEffect, useLayoutEffect, useRef } from "react";

export function SideEffects() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    console.log("Layout:", ref.current?.offsetWidth);
  });

  useEffect(() => {
    console.log("Effect:", ref.current?.offsetWidth);
  });

  console.log("Render");

  return (
    <div
      ref={ref}
      style={{ width: 200 }}
    >
      Hello
    </div>
  );
}