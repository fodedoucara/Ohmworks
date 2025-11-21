import { Route, Routes } from "react-router-dom"
import Home from "./pages/home";
import Workspace from "./pages/Workspace";
import Navbar from "./components/Navbar";




function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace" element={<Workspace />} />
      </Routes>
    </>
  );
}
export default App;
