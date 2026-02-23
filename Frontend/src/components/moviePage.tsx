import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

interface CardData {
  id: string;
  title: string;
  videoId: string;
  longDescription: string;
}

function VideoPage() {
  const { id } = useParams();
  const [card, setCard] = useState<CardData | null>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/cards/${id}`)
      .then(res => res.json())
      .then(data => setCard(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!card) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  return (
    <div style={styles.textSection}>
  <h1 style={styles.title}>{card.title}</h1>

  <p style={styles.description}>
    {card.longDescription}
  </p>

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
  );
}

const styles: Record<string, CSSProperties> = {
  showtimeHeader: {
  marginTop: "30px",
},

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
  videoSection: {
    flex: 1,
    minWidth: "400px",
  },
  iframe: {
    borderRadius: "12px",
  },
  textSection: {
    flex: 1,
    minWidth: "400px",
  },
  title: {
    marginTop: 0,
  },
  description: {
    fontSize: "16px",
    lineHeight: "1.6",
  },
};

export default VideoPage;