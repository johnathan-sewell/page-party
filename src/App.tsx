import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Lobby } from "./Lobby";
import { Nav } from "./Nav";

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
