import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getChildren, saveChildren } from "../utils/storage";

// seeds for favorite activities / tasks (derived from uploaded PDF)
const TASKS_SEED = [
  "Drink water in morning",
  "Brush teeth twice",
  "Make bed",
  "Read 10 minutes",
  "Play outside",
  "Do 10 jumping jacks",
  "Eat a fruit",
  "Sleep on time",
  "Wake up on time",
  "Complete homework",
  "Practice an instrument",
];

export default function ChildForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    parentName: "",
    favoriteActivity: TASKS_SEED[0],
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function createChild(e) {
    e.preventDefault();
    if (!form.name || !form.age) {
      alert("Please enter name and age.");
      return;
    }

    const children = getChildren();
    const id = uuidv4();
    const newChild = {
      id,
      ...form,
      avatar: "",
      goals: [],
      weeklyGoals: [],
      joules: 0,
      tasks: TASKS_SEED.map((t, i) => ({
        id: `t-${i}`,
        title: t,
        totalCompleted: 0,
        completedDates: []
      })),
      reports: []
    };
    children.push(newChild);
    saveChildren(children);
    localStorage.setItem("hj_current_child", id);
    nav("/child-dashboard");
  }

  return (
    <div className="card">
      <h2>Child Signup</h2>
      <form onSubmit={createChild} className="form">
        <label>
          Your name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          Phone number
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <label>
          Age
          <input name="age" value={form.age} onChange={handleChange} />
        </label>
        <label>
          Parent's name
          <input name="parentName" value={form.parentName} onChange={handleChange} />
        </label>
        <label>
          Favorite activity
          <select name="favoriteActivity" value={form.favoriteActivity} onChange={handleChange}>
            {TASKS_SEED.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <div className="btn-row">
          <button type="submit" className="btn">Create account & Enter</button>
          <button type="button" className="btn btn-ghost" onClick={() => nav("/")}>Back</button>
        </div>
      </form>
    </div>
  );
}
