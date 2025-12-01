import React, { useEffect, useState } from "react";
import { getChildren, getParents } from "../utils/storage";
import { useNavigate } from "react-router-dom";

export default function ParentDashboard() {
  const nav = useNavigate();
  const [parent, setParent] = useState(null);
  const [child, setChild] = useState(null);

  useEffect(() => {
    const parentId = localStorage.getItem("hj_current_parent");
    if (!parentId) {
      nav("/");
      return;
    }
    const parents = getParents();
    const p = parents.find(x => x.id === parentId);
    if (!p) {
      nav("/");
      return;
    }
    setParent(p);
    if (p.linkedChildId) {
      const all = getChildren();
      const c = all.find(x => x.id === p.linkedChildId);
      if (c) setChild(c);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("hj_current_parent");
    nav("/");
  }

  if (!parent) return null;

  return (
    <div className="card">
      <h2>Welcome, {parent.name}</h2>
      {!child ? (
        <>
          <p>No child linked. Please scan the child's barcode from the child's profile screen on their device and relogin.</p>
          <div className="btn-row">
            <button className="btn" onClick={()=>{localStorage.removeItem("hj_current_parent"); nav("/");}}>Back</button>
          </div>
        </>
      ) : (
        <>
          <h3>Child: {child.name} (age {child.age})</h3>
          <div className="stats">
            <div><strong>Joules:</strong> {child.joules || 0}</div>
            <div><strong>Total tasks:</strong> {child.tasks.length}</div>
            <div><strong>Completed total:</strong> {child.tasks.reduce((s,t)=>s+(t.totalCompleted||0),0)}</div>
            <div><strong>Pending today:</strong> {
              // quick: tasks not yet done today
              (() => {
                const today = new Date().toISOString().slice(0,10);
                return child.tasks.filter(t => !t.completedDates.includes(today)).length;
              })()
            }</div>
          </div>

          <section style={{marginTop:12}}>
            <h4>Recent activity</h4>
            <ul>
              {child.reports.slice().reverse().map((r,i)=>(
                <li key={i}><strong>{r.date}</strong>: {r.task}</li>
              ))}
              {child.reports.length===0 && <li>No activity yet</li>}
            </ul>
          </section>

          <div className="btn-row" style={{marginTop:12}}>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </div>
        </>
      )}
    </div>
  );
}
