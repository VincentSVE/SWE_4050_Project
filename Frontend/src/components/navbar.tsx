import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

type SortBy = "Relevance" | "Title (A–Z)" | "Rating (High→Low)";

type SearchFilters = {
  query: string;
  genre: string;       // dynamic from DB
  mpaa: string;        // dynamic from DB
  minScore: number;    // placeholder slider (0–10)
  sortBy: SortBy;
};

type Movie = {
  id: string;
  title: string;
  description?: string;
  trailer?: string;
  poster?: string;
  rating?: string;     // MPAA like "PG", "R"
  genre?: string[];    // ["Action", "Horror"]
  currentlyPlaying?: boolean;
};

// Optional Vite env, fallback to local backend
const API_BASE =
  (import.meta as any).env?.VITE_API_URL?.trim?.() || "http://127.0.0.1:8000";

export default function Navbar() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    genre: "Any",
    mpaa: "Any",
    minScore: 0,
    sortBy: "Relevance",
  });

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        {/* LEFT — Brand */}
        <div style={styles.left}>
          <Link to="/" style={styles.brand}>
            🎬 CineScope
          </Link>
        </div>

        {/* CENTER — Main Nav */}
        <div style={styles.center}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/explore" style={styles.navLink}>Explore</Link>
          <Link to="/about" style={styles.navLink}>About</Link>
        </div>

        {/* RIGHT — Search dropdown + Auth */}
        <div style={styles.right}>
          <SearchDropdown filters={filters} onChange={setFilters} />
          <button style={styles.ghostBtn}>Log In</button>
          <button style={styles.primaryBtn}>Sign Up</button>
        </div>
      </div>
    </header>
  );
}

function SearchDropdown({
  filters,
  onChange,
}: {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [moviesError, setMoviesError] = useState("");

  // ✅ dynamic options derived from DB
  const genres = useMemo(() => {
    const set = new Set<string>();
    for (const m of movies) {
      for (const g of m.genre || []) set.add(g);
    }
    return ["Any", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [movies]);

  const mpaaRatings = useMemo(() => {
    const set = new Set<string>();
    for (const m of movies) {
      if (m.rating) set.add(m.rating);
    }
    return ["Any", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [movies]);

  const sorts: SortBy[] = useMemo(
    () => ["Relevance", "Title (A–Z)", "Rating (High→Low)"],
    []
  );

  // Fetch movies once when dropdown first opens
  useEffect(() => {
    if (!open) return;
    if (movies.length > 0) return;

    const controller = new AbortController();
    setLoadingMovies(true);
    setMoviesError("");

    fetch(`${API_BASE}/movies`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load movies (${res.status})`);
        return res.json();
      })
      .then((data: Movie[]) => setMovies(data))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setMoviesError(err.message);
      })
      .finally(() => setLoadingMovies(false));

    return () => controller.abort();
  }, [open, movies.length]);

  // Close on outside click + Escape
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const activeCount =
    (filters.query.trim() ? 1 : 0) +
    (filters.genre !== "Any" ? 1 : 0) +
    (filters.mpaa !== "Any" ? 1 : 0) +
    (filters.minScore > 0 ? 1 : 0) +
    (filters.sortBy !== "Relevance" ? 1 : 0);

  // ✅ Live filtered results (still uses DB data, but filtered client-side)
  const filteredResults = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    let results = movies.filter((m) => {
      const titleOk = !q || m.title.toLowerCase().includes(q);

      const genreOk =
        filters.genre === "Any" ||
        (m.genre || []).some((g) => g.toLowerCase() === filters.genre.toLowerCase());

      const mpaaOk = filters.mpaa === "Any" || (m.rating || "") === filters.mpaa;

      return titleOk && genreOk && mpaaOk;
    });

    if (filters.sortBy === "Title (A–Z)") {
      results = results.slice().sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sortBy === "Rating (High→Low)") {
      // best-effort ordering; ratings are strings
      const order = ["NC-17", "R", "PG-13", "PG", "G"];
      results = results
        .slice()
        .sort(
          (a, b) => (order.indexOf(b.rating || "") - order.indexOf(a.rating || ""))
        );
    }

    return results.slice(0, 8);
  }, [movies, filters]);

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        style={styles.searchButton}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Search{activeCount ? ` (${activeCount})` : ""} ▾
      </button>

      {open && (
        <div ref={panelRef} style={styles.dropdown}>
          <div style={styles.row}>
            <label style={styles.label}>Title</label>
            <input
              value={filters.query}
              onChange={(e) => onChange({ ...filters, query: e.target.value })}
              placeholder="e.g., Dune"
              style={styles.input}
            />
          </div>

          <div style={styles.grid2}>
            <div style={styles.row}>
              <label style={styles.label}>Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => onChange({ ...filters, genre: e.target.value })}
                style={styles.select}
              >
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div style={styles.row}>
              <label style={styles.label}>MPAA</label>
              <select
                value={filters.mpaa}
                onChange={(e) => onChange({ ...filters, mpaa: e.target.value })}
                style={styles.select}
              >
                {mpaaRatings.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Min Score: {filters.minScore}</label>
            <input
              type="range"
              min={0}
              max={10}
              value={filters.minScore}
              onChange={(e) => onChange({ ...filters, minScore: Number(e.target.value) })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Sort by</label>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as SortBy })}
              style={styles.select}
            >
              {sorts.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* ✅ Results from DB */}
          <div style={{ marginTop: 8 }}>
            <div style={{ ...styles.label, marginBottom: 6 }}>Results</div>

            {loadingMovies && <div style={{ opacity: 0.85 }}>Loading movies…</div>}
            {moviesError && <div style={{ color: "#ffb4b4" }}>Error: {moviesError}</div>}

            {!loadingMovies && !moviesError && filteredResults.length === 0 && (
              <div style={{ opacity: 0.85 }}>No matches.</div>
            )}

            {!loadingMovies && !moviesError && filteredResults.length > 0 && (
              <div style={{ display: "grid", gap: 8 }}>
                {filteredResults.map((m) => (
                  <Link
                    key={m.id}
                    to={`/movies/${m.id}`}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "44px 1fr",
                      gap: 10,
                      alignItems: "center",
                      textDecoration: "none",
                      color: "white",
                      padding: 8,
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <img
                      src={m.poster || "https://via.placeholder.com/44x44?text=%F0%9F%8E%AC"}
                      alt={m.title}
                      style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }}
                    />
                    <div style={{ display: "grid", gap: 2 }}>
                      <div style={{ fontWeight: 800, lineHeight: 1.1 }}>{m.title}</div>
                      <div style={{ fontSize: 12, opacity: 0.8 }}>
                        {(m.rating || "NR")} • {(m.genre || []).slice(0, 2).join(", ")}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div style={styles.actions}>
            <button
              style={styles.clearBtn}
              onClick={() =>
                onChange({ query: "", genre: "Any", mpaa: "Any", minScore: 0, sortBy: "Relevance" })
              }
            >
              Clear
            </button>
            <button style={styles.applyBtn} onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    zIndex: 50,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    background: "rgba(10, 10, 12, 0.4)",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
  },

  inner: {
    height: "100%",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "0 24px",
  },

  left: { display: "flex", justifyContent: "flex-start" },

  brand: {
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: 1,
    color: "white",
  },

  center: { display: "flex", justifyContent: "center", gap: 30 },

  navLink: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.85)",
    fontWeight: 600,
    fontSize: 15,
    letterSpacing: 0.5,
  },

  right: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 },

  searchButton: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: 46,
    width: 340,
    padding: 12,
    borderRadius: 14,
    background: "rgba(0,0,0,0.82)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    display: "grid",
    gap: 10,
    color: "white",
  },

  row: { display: "grid", gap: 6 },

  label: {
    fontSize: 12,
    fontWeight: 800,
    color: "white",
    letterSpacing: 0.3,
  },

  input: {
    padding: "10px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
  },

  select: {
    padding: "10px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
    appearance: "none",
  },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },

  actions: {
    marginTop: 6,
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  },

  clearBtn: {
    flex: 1,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.20)",
    color: "white",
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 800,
  },

  applyBtn: {
    flex: 1,
    background: "white",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "black",
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 900,
  },

  ghostBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "white",
    padding: "8px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },

  primaryBtn: {
    background: "white",
    color: "black",
    border: "none",
    padding: "8px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  },
};