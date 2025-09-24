import React, { useState, useEffect } from "react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      // fake API call
      await new Promise((res) => setTimeout(res, 1000));
      setResults([query + " 1", query + " 2", query + " 3"]);
      setLoading(false);
    }, 500); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search fruits..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      <ul>
        {results.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
