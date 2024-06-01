import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Lobby } from "./Room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
