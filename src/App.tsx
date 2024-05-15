import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateRoom } from "./CreateRoom";
import { Room } from "./Room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
