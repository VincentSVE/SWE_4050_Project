import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import type { CSSProperties } from "react";

function BookingPage() {
  const bgUrl = "/images/backgroundImage.jpg";
  const { title } = useParams();
  const [searchParams] = useSearchParams();
  const time = searchParams.get("time");

  const PRICES = {
    adult: 12.99,
    child: 7.99,
    senior: 7.99,
  };

  const [adultQty, setAdultQty] = useState(0);
  const [childQty, setChildQty] = useState(0);
  const [seniorQty, setSeniorQty] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  const totalPrice =
    adultQty * PRICES.adult +
    childQty * PRICES.child +
    seniorQty * PRICES.senior;

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) => {
      const updated = new Set(prev);
      if (updated.has(seatId)) {
        updated.delete(seatId);
      } else {
        updated.add(seatId);
      }
      return updated;
    });
  };

  return (
    <div style={styles.page}>
      {/* Background image layer */}
      <div style={{ ...styles.bg, backgroundImage: `url(${bgUrl})` }} />

      {/* Dark overlay + scrollable content */}
      <div style={styles.overlay}>
        <div style={styles.container}>
          <h1 style={styles.header}>
            <u>Checkout</u>
          </h1>

          <h2>{title}</h2>
          <h3>
            <u>Selected Showtime:</u> {time}
          </h3>

          <div style={styles.ticketSection}>
            <TicketRow
              label="Adult"
              price={PRICES.adult}
              value={adultQty}
              onChange={setAdultQty}
            />

            <TicketRow
              label="Child"
              price={PRICES.child}
              value={childQty}
              onChange={setChildQty}
            />

            <TicketRow
              label="Senior"
              price={PRICES.senior}
              value={seniorQty}
              onChange={setSeniorQty}
            />
          </div>

          <h2 style={styles.total}>
            <u>Total: ${totalPrice.toFixed(2)}</u>
          </h2>

          <h2 style={{ marginTop: "50px" }}>Select Seats:</h2>

          <div style={styles.gridWrapper}>
            {Array.from({ length: 5 }).map((_, row) => (
              <div key={row} style={styles.row}>
                {Array.from({ length: 10 }).map((_, col) => {
                  const seatId = `${row + 1}-${col + 1}`;
                  const isSelected = selectedSeats.has(seatId);

                  return (
                    <div
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      style={{
                        ...styles.seat,
                        backgroundColor: isSelected ? "#691A0A" : "#8B0000",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <button style={styles.confirmBtn}>Confirm Order</button>
        </div>
      </div>
    </div>
  );
}

interface TicketRowProps {
  label: string;
  price: number;
  value: number;
  onChange: (value: number) => void;
}

function TicketRow({ label, price, value, onChange }: TicketRowProps) {
  return (
    <div style={styles.rowTicket}>
      <span>
        {label} (${price})
      </span>

      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={styles.select}
      >
        {[0, 1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  // fixes “white border” by covering the entire viewport regardless of body margin
  page: {
    position: "fixed",
    inset: 0,
    overflow: "hidden",
    backgroundColor: "#0a0a0c",
  },

  // background image layer
  bg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  // dark overlay + scroll container (so content can scroll)
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingTop: 90, // accounts for your fixed Navbar
    paddingBottom: 40,
    overflowY: "auto",
    overflowX: "hidden",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    color: "#F2F0EF",
    padding: "0 20px",
  },

  header: {
    textAlign: "center",
  },

  ticketSection: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  rowTicket: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "18px",
  },

  select: {
    padding: "5px 10px",
    fontSize: "16px",
    borderRadius: "6px",
  },

  total: {
    marginTop: "40px",
    fontSize: "24px",
  },

  gridWrapper: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    backgroundColor: "#813e3e",
    borderRadius: "12px",
    justifyContent: "center",
    width: "600px",
    minHeight: "300px",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "16px 12px",
  },

  row: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },

  seat: {
    width: "40px",
    height: "40px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "1px solid #999",
    transition: "0.2s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
  },

  confirmBtn: {
    marginTop: "30px",
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.10)",
    color: "white",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "16px",
  },
};

export default BookingPage;