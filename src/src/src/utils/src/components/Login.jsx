import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  return (
    <div className="card">
      <h2>Hello! Welcome to Habit Joules 👋</h2>
      <p>Are you a Parent or a Child? Choose below to continue.</p>
      <div className="btn-row">
        <button onClick={() => nav("/child-form")} className="btn">I'm a Child</button>
        <button onClick={() => nav("/parent-form")} className="btn btn-secondary">I'm a Parent</button>
      </div>

      <hr />
      <small>
        Habit Joules turns habit-building into a fun adventure with HabitJoulesBot — track habits, journal, and earn Joules!
      </small>
    </div>
  );
}
