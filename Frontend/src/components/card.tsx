import { Link } from "react-router-dom";
import type { CSSProperties } from "react";

interface CardProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

function Card({ id, title, imageUrl, description }: CardProps) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{title}</h2>

      <Link to={`/video/${id}`}>
        <img src={imageUrl} alt={title} style={styles.image} />
      </Link>

      <p style={styles.description}>{description}</p>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    width: "300px",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    margin: 0,
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
    cursor: "pointer",
  },
  description: {
    margin: 0,
    fontSize: "14px",
    color: "#555",
  },
};

export default Card;
