import Link from "next/link";
import { ReactNode } from "react";

export default function NotFound(): ReactNode {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>404</h1>
        <p style={styles.message}>Page not found</p>
        <p style={styles.description}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" style={styles.link}>
          Go back home
        </Link>
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
  content: {
    textAlign: "center" as const,
    padding: "20px",
  },
  heading: {
    fontSize: "72px",
    fontWeight: "bold",
    color: "#1f2937",
    margin: "0 0 10px 0",
  },
  message: {
    fontSize: "24px",
    color: "#374151",
    margin: "0 0 10px 0",
  },
  description: {
    fontSize: "16px",
    color: "#6b7280",
    margin: "0 0 20px 0",
  },
  link: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "16px",
  },
};
