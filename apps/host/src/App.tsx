import React, { Suspense } from "react";

const Products = React.lazy(() => import("products/Products"));

export default function App() {
  return (
    <>
      <h1>Host Application</h1>

      <Suspense fallback={<p>Loading...</p>}>
        <Products />
      </Suspense>
    </>
  );
}