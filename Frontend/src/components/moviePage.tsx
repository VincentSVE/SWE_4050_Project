import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

interface MovieData {
  id: string;
  title: string;
  trailer: string;
  description: string;
}

function extractYouTubeId(url: string): string {
  if (!url) return "";

  const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if (shortMatch) return shortMatch[1];

  const longMatch = url.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (longMatch) return longMatch[1];

  return "";
}

const API_BASE =
  import.meta.env.VITE_API_URL?.trim() || "http://127.0.0.1:8000";

function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    setError("");
    setMovie(null);

    fetch(`${API_BASE}/movies/${id}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data: MovieData) => setMovie(data))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
      });

    return () => controller.abort();
  }, [id]);

  const videoId = useMemo(
    () => (movie ? extractYouTubeId(movie.trailer) : ""),
    [movie]
  );

  if (error) return <h2 style={{ padding: "40px" }}>Error: {error}</h2>;
  if (!movie) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  return (
    <div style={styles.container}>
      <div style={styles.videoSection}>
        {videoId ? (
          <iframe
            width="100%"
            height="315"
            style={styles.iframe}
            src={`https://www.youtube.com/embed/${videoId}`}
            title={movie.title}
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <p>No trailer available.</p>
        )}
      </div>

      <div style={styles.textSection}>
        <h1 style={styles.title}>{movie.title}</h1>
        <p style={styles.description}>{movie.description}</p>

        <h3 style={styles.showtimeHeader}>Showtimes</h3>
        <div style={styles.showtimeRow}>
          {["12:00 PM", "3:00 PM", "5:00 PM", "7:00 PM", "10:00 PM"].map(
            (time) => (
              <span key={time} style={styles.showtime}>
                {time}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  showtimeHeader: { marginTop: "30px" },
  showtimeRow: {
    display: "flex",
    gap: "20px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  showtime: {
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: 500,
  },
  container: {
    display: "flex",
    gap: "40px",
    padding: "40px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  videoSection: { flex: 1, minWidth: "400px" },
  iframe: { borderRadius: "12px" },
  textSection: { flex: 1, minWidth: "400px" },
  title: { marginTop: 0 },
  description: { fontSize: "16px", lineHeight: "1.6" },
};

export default MoviePage;