import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Lobby } from "./components/Lobby";
import { Nav } from "./components/Nav";

function App() {
  return (
    <>
      <Nav />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Lobby />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
