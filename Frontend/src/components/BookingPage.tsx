import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import type { CSSProperties } from "react";

function BookingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const time = searchParams.get("time");

  // Hardcoded prices
  const PRICES = {
    adult: 12.50,
    child: 8.99,
    senior: 8.99,
  };

  const [adultQty, setAdultQty] = useState(0);
  const [childQty, setChildQty] = useState(0);
  const [seniorQty, setSeniorQty] = useState(0);

  const total =
    adultQty * PRICES.adult +
    childQty * PRICES.child +
    seniorQty * PRICES.senior;

  return (
    <div style={styles.container}>
      <h1>Booking</h1>

      <h2>Movie ID: {id}</h2>
      <h3>Selected Showtime: {time}</h3>

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

      <h2 style={styles.total}>Total: ${total}</h2>
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
    <div style={styles.row}>
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
  container: {
    padding: "40px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  ticketSection: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "18px",
  },
  select: {
    padding: "5px 10px",
    fontSize: "16px",
  },
  total: {
    marginTop: "40px",
    fontSize: "24px",
  },
};

export default BookingPage;