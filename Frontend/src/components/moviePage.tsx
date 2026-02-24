import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

interface CardData {
  id: string;
  title: string;
  videoId: string;
  longDescription: string;
  posterUrl?: string;
}

function VideoPage() {
  const { id } = useParams();
  const [card, setCard] = useState<CardData | null>(null);

  useEffect(() => {
    
    /*
    fetch(`http://127.0.0.1:8000/cards/${id}`)
      .then(res => res.json())
      .then(data => setCard(data))
      .catch(err => console.error(err));
    */

   
    const hardcodedCard: CardData = {
      id: id || "1",
      title: "Inception",
      videoId: "YoHD9XEInc0",
      longDescription:
        "A skilled thief is given a chance at redemption if he can successfully perform inception — planting an idea into someone's subconscious.",
      posterUrl:
        "https://m.media-amazon.com/images/I/51s+QvXK8EL._AC_.jpg",
    };

    setCard(hardcodedCard);
  }, [id]);

  if (!card) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  return (
    <div style={styles.container}>
      
      {/* 🎬 Video Section */}
      <div style={styles.videoSection}>
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${card.videoId}`}
          title={card.title}
          style={styles.iframe}
          allowFullScreen
        ></iframe>
      </div>

      {/* 🎞 Poster + Text Section */}
      <div style={styles.textSection}>
        
        {/* Poster */}
        {card.posterUrl && (
          <img
            src={card.posterUrl}
            alt={card.title}
            style={styles.poster}
          />
        )}

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
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    marginTop: "50px",
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
  poster: {
    width: "250px",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  title: {
    marginTop: 0,
  },
  description: {
    fontSize: "16px",
    lineHeight: "1.6",
  },
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
};

export default VideoPage;