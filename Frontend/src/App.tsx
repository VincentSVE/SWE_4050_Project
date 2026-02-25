import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import MoviePage from "./components/moviePage";
import MovieDetail from "./Pages/MovieDetail";
import HomePage from "./Pages/HomePage";
import BookingPage from "./Pages/BookingPage";

function App() {
  return (
    <div style={styles.appWrapper}>
      {/* Global Navigation */}
      <Navbar />

      {/* Routes */}
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<HomePage />} />

        {/* Explore Route (if your Navbar links to /explore) */}
        <Route path="/explore" element={<MoviePage />} />

        {/* Movie Detail Route (new) */}
        <Route path="/movies/:id" element={<MovieDetail />} />

        {/* Backward-compat: keep your old route working */}
        <Route path="/video/:id" element={<Navigate to="/movies/:id" replace />} />

        {/* Optional: 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/booking/:id/:time" element={<BookingPage />} />
        <Route path="/booking/:title" element={<BookingPage />} />
      </Routes>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appWrapper: {
    minHeight: "100vh",
    width: "100vw",
  },
};

export default App;