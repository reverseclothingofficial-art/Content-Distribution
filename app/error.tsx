"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error
    console.error("Global error:", error);
  }, [error]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>⚠️ Something went wrong</h1>
        <p>{error.message}</p>
        {error.digest && <p style={styles.digest}>Error ID: {error.digest}</p>}
        <button onClick={() => reset()} style={styles.button}>
          Try again
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center" as const,
  },
  digest: {
    fontSize: "12px",
    color: "#999",
    marginTop: "10px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
