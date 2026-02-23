import { useState} from "react";
import type { CSSProperties , SubmitEvent } from 'react';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onHomeClick?: () => void;
}

function Navbar({ onSearch, onHomeClick }: NavbarProps) {
  const [search, setSearch] = useState<string>("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(search);
  };

  return (
    <nav style={styles.navbar}>
     
      <div style={styles.side} />

    
      <div style={styles.center}>
        <button style={styles.homeButton} onClick={onHomeClick}>
          Home
        </button>
      </div>

   
      <div style={styles.side}>
        <form onSubmit={handleSubmit} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            style={styles.input}
          />
          <button type="submit" style={styles.searchButton}>
            Search
          </button>
        </form>
      </div>
    </nav>
  );
}

const styles: Record<string, CSSProperties> = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    height: "60px",
    backgroundColor: "#1f2937",
    color: "white",
  },
  center: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  side: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  homeButton: {
    padding: "8px 16px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
  },
  searchForm: {
    display: "flex",
    gap: "8px",
  },
  input: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  searchButton: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#10b981",
    color: "white",
  },
};

export default Navbar;
