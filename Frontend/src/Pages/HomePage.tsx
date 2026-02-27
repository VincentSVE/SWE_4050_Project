import { useEffect, useMemo, useState } from "react";
import MovieCard from "../components/movieCard";
import type { Movie } from "../types/Movie";

export default function HomePage() {
  const bgUrl = "/images/backgroundImage.jpg";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/movies`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data: Movie[] = await res.json();
        setMovies(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [API_URL]);

  const { currentlyRunning, comingSoon } = useMemo(() => {
    const currentlyRunning = movies.filter((m) => m.currentlyPlaying);
    const comingSoon = movies.filter((m) => !m.currentlyPlaying);
    return { currentlyRunning, comingSoon };
  }, [movies]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay + Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          paddingTop: "80px",
          paddingLeft: 60,
          paddingRight: 60,
          display: "flex",
          gap: 60, 
        }}
      >
        {/* LEFT (2/3) */}
        <section style={styles.sectionWide}>
          <h1 style={styles.h1}>Currently Running</h1>

          {loading && <p style={styles.msg}>Loading…</p>}
          {error && <p style={styles.err}>{error}</p>}

          {!loading && !error && (
            <div style={styles.grid}>
              {currentlyRunning.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}
        </section>

        {/* Divider */}
        <div style={styles.divider} />

        {/* RIGHT (1/3) */}
        <aside style={styles.sectionNarrow}>
          <h1 style={styles.h1}>Coming Soon</h1>

          {loading && <p style={styles.msg}>Loading…</p>}
          {error && <p style={styles.err}>{error}</p>}

          {!loading && !error && (
            <div style={styles.grid}>
              {comingSoon.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  h1: {
    color: "white",
    margin: 0,
    fontSize: 28,
    textAlign: "center", // centers header over its movies
    width: "100%",
  },
  msg: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 12,
    textAlign: "center",
  },
  err: {
    color: "#ffb3b3",
    marginTop: 12,
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
    gap: 18,
    marginTop: 18,
  },

  // Optional: slight background panels so it's super obvious where each column is
  sectionWide: {
    flex: 2,
    minWidth: 0,
    background: "rgba(0,0,0,0.35)",
    padding: 18,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  sectionNarrow: {
    flex: 1,
    minWidth: 0,
    background: "rgba(0,0,0,0.35)",
    padding: 18,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
  },

  divider: {
    width: 2,
    background: "rgba(255,255,255,0.18)",
    borderRadius: 999,
  },
};