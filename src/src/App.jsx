import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import ChildForm from "./components/ChildForm";
import ParentForm from "./components/ParentForm";
import ChildDashboard from "./components/ChildDashboard";
import ParentDashboard from "./components/ParentDashboard";
import Profile from "./components/Profile";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1><Link to="/" className="logo">Habit Joules</Link></h1>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/child-form" element={<ChildForm />} />
          <Route path="/parent-form" element={<ParentForm />} />
          <Route path="/child-dashboard" element={<ChildDashboard />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <small>Habit Joules — healthy choices build up energy (joules)</small>
      </footer>
    </div>
  );
}
