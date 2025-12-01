import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getChildren, saveChildren } from "../utils/storage";
import { sampleSize } from "../utils/arrays";

function TodayMissions({ child, onComplete }) {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    if (!child) return;
    // pick 3 random tasks from child's tasks
    const titles = child.tasks.map(t => t.title);
    setMissions(sampleSize(titles, 3));
  }, [child]);

  function markDone(title) {
    onComplete(title);
  }

  return (
    <div>
      <h3>Today's Missions</h3>
      <ul className="missions">
        {missions.map(m => (
          <li key={m}>
            <span>{m}</span>
            <button className="btn btn-small" onClick={()=>markDone(m)}>Mark Done</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ChildDashboard() {
  const nav = useNavigate();
  const [child, setChild] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("hj_current_child");
    const all = getChildren();
    const found = all.find(c => c.id === id);
    if (!found) {
      nav("/");
      return;
    }
    setChild(found);
  }, []);

  function handleLogout() {
    localStorage.removeItem("hj_current_child");
    nav("/");
  }

  function onComplete(title) {
    // update child's tasks + joules + reports
    const all = getChildren();
    const idx = all.findIndex(c => c.id === child.id);
    if (idx === -1) return;
    const today = new Date().toISOString().slice(0,10);
    const task = all[idx].tasks.find(t => t.title === title);
    if (task) {
      // avoid double marking same day
      if (!task.completedDates.includes(today)) {
        task.completedDates.push(today);
        task.totalCompleted = (task.totalCompleted || 0) + 1;
        // award joules (simple: 10 per task)
        all[idx].joules = (all[idx].joules || 0) + 10;
        all[idx].reports.push({ date: today, task: title });
        saveChildren(all);
        setChild({...all[idx]});
      } else {
        alert("Already marked done today for this mission!");
      }
    }
  }

  if (!child) return null;

  return (
    <div className="card">
      <h2>Welcome, {child.name}!</h2>
      <div className="meta">
  <div><strong>Joules:</strong> {child.joules || 0}</div>
  <div><strong>Favorite:</strong> {child.favoriteActivity}</div>
  <div><strong>Child id:</strong> <code style={{padding:"2px 6px",borderRadius:6,background:"#f3f3f3"}}>{child.id}</code></div>
</div>


      <TodayMissions child={child} onComplete={onComplete} />

      <hr />
      <div className="btn-row">
        <Link to="/profile" className="btn">Profile</Link>
        <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
      </div>

      <section style={{marginTop: 16}}>
        <h3>Recent activity</h3>
        <ul>
          {child.reports.slice().reverse().map((r, i) => (
            <li key={i}><strong>{r.date}</strong>: {r.task}</li>
          ))}
          {child.reports.length===0 && <li>No activity yet — complete missions to earn Joules!</li>}
        </ul>
      </section>
    </div>
  );
}
