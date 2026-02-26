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
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Explore */}
        <Route path="/explore" element={<MoviePage />} />

        {/* Movie Detail (new canonical route) */}
        <Route path="/movies/:id" element={<MovieDetail />} />

        {/* Old route - redirect to canonical route */}
        <Route path="/video/:id" element={<VideoRedirect />} />

        {/* Booking (matches MovieDetail navigate(`/booking/${title}?time=${t}`)) */}
        <Route path="/booking/:title" element={<BookingPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

/**
 * Redirect /video/:id -> /movies/:id while preserving the actual :id value.
 * (Navigate cannot interpolate params in a string like "/movies/:id".)
 */
function VideoRedirect() {
  const url = window.location.pathname; // e.g. "/video/abc123"
  const id = url.split("/").pop();      // "abc123"
  return <Navigate to={`/movies/${id}`} replace />;
}

const styles: Record<string, React.CSSProperties> = {
  appWrapper: {
    minHeight: "100vh",
    width: "100vw",
  },
};

export default App;