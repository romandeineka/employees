import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage/LoginPage";
import EmployeesPage from "./components/EmployeesPage/EmployeesPage";
import Departmens from "./components/Departmens/Departmens";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/departmens" element={<Departmens />} />
    </Routes>
  );
}

export default App;
