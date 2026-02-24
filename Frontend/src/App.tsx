import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import MoviePage from "./components/moviePage";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <div style={styles.appWrapper}>
      {/* Global Navigation */}
      <Navbar />

      {/* Routes */}
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<HomePage />} />

        {/* Movie Detail Route */}
        <Route path="/video/:id" element={<MoviePage />} />
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