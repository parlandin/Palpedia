import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { PalsList } from "./pages/PalsList";
import { BreedingLayout } from "./pages/BreedingLayout";
import { BreedingSimple } from "./pages/BreedingSimple";
import { BreedingTree } from "./pages/BreedingTree";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PalsList />} />
            <Route path="/breeding" element={<BreedingLayout />}>
              <Route
                index
                element={<Navigate to="/breeding/simple" replace />}
              />
              <Route path="simple" element={<BreedingSimple />} />
              <Route path="tree" element={<BreedingTree />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
