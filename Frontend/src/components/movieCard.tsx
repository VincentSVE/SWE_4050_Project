import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/Movie";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  const navigate = useNavigate();

  const movieId = (movie as any)._id ?? (movie as any).id;

  const handleClick = () => {
    if (!movieId) {
      console.error("Movie ID is missing:", movie);
      return;
    }
    navigate(`/movies/${movieId}`);
  };

  return (
    <div
      style={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <img src={movie.poster} alt={movie.title} style={styles.poster} />
      <div style={styles.meta}>
        <h3 style={styles.title}>{movie.title}</h3>
        <p style={styles.sub}>
          {movie.rating} • {movie.genre?.join(", ")}
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "rgba(0,0,0,0.72)",
    borderRadius: 12,
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  poster: {
    width: "100%",
    height: 240,
    objectFit: "cover",
    display: "block",
  },
  meta: {
    padding: 12,
  },
  title: {
    color: "white",
    margin: 0,
    fontSize: 16,
    lineHeight: "20px",
  },
  sub: {
    margin: "6px 0 0",
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
  },
};