import { Routes, Route } from "react-router-dom";
import Card from "./components/card";
import MoviePage from "./components/moviePage";
import Navbar from "./components/navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <div style={styles.container}>
              <Card
                id="1"
                title="Mountains"
                imageUrl=""
                description=""
              />
              <Card
                id="2"
                title=""
                imageUrl=""
                description="."
              />
            </div>
          }
        />

        <Route path="/video/:id" element={<MoviePage />} />
      </Routes>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "20px",
    padding: "40px",
  },
};

export default App;
