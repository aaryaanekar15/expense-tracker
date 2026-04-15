import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Main from "./pages/Main";
import TrackEx from './pages/TrackEx';
import ManageEx from './pages/ManageEx';

function App() {
  return (

    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trackex" element={<TrackEx />} />
        <Route path="/manageex" element={<ManageEx />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;