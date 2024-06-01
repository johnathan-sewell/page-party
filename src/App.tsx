import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Room } from "./Room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
