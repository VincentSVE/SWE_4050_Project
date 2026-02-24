import { Link } from "react-router-dom";

export default function Navbar() {
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

        {/* RIGHT — Search + Auth */}
        <div style={styles.right}>
          <input placeholder="Search…" style={styles.searchInput} />
          <button style={styles.ghostBtn}>Log In</button>
          <button style={styles.primaryBtn}>Sign Up</button>
        </div>
      </div>
    </header>
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

  /* LEFT */
  left: {
    display: "flex",
    justifyContent: "flex-start",
  },

  brand: {
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: 1,
    color: "white",
  },

  /* CENTER */
  center: {
    display: "flex",
    justifyContent: "center",
    gap: 30,
  },

  navLink: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.85)",
    fontWeight: 600,
    fontSize: 15,
    letterSpacing: 0.5,
  },

  /* RIGHT */
  right: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },

  searchInput: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
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
