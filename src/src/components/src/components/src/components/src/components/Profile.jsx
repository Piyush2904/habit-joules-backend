// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { getChildren, saveChildren } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code"; // kept for optional QR but not required

export default function Profile() {
  const nav = useNavigate();
  const [child, setChild] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [showBarcode, setShowBarcode] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("hj_current_child");
    if (!id) { nav("/"); return; }
    const all = getChildren();
    const found = all.find(c => c.id === id);
    if (!found) { nav("/"); return; }
    setChild(found);
    setForm({ name: found.name, avatar: found.avatar, goals: (found.goals||[]).join("|"), weeklyGoals: (found.weeklyGoals||[]).join("|") });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function uploadAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  }

  function save() {
    const all = getChildren();
    const idx = all.findIndex(c => c.id === child.id);
    all[idx].name = form.name;
    all[idx].avatar = form.avatar;
    all[idx].goals = form.goals ? form.goals.split("|").map(s=>s.trim()).filter(Boolean) : [];
    all[idx].weeklyGoals = form.weeklyGoals ? form.weeklyGoals.split("|").map(s=>s.trim()).filter(Boolean) : [];
    saveChildren(all);
    setChild(all[idx]);
    setEditing(false);
    alert("Profile saved.");
  }

  function copyId() {
    if (!child) return;
    navigator.clipboard.writeText(child.id)
      .then(()=> alert("Child id copied to clipboard — share this with your parent."))
      .catch(()=> alert("Unable to copy. Please copy the id manually: " + child.id));
  }

  if (!child) return null;

  return (
    <div className="card">
      <h2>{child.name}'s Profile</h2>
      <div className="profile-top">
        <div className="avatar">
          {form.avatar ? <img src={form.avatar} alt="avatar" /> : <div className="avatar-placeholder">No photo</div>}
        </div>
        <div>
          <div><strong>Age:</strong> {child.age}</div>
          <div><strong>Parent:</strong> {child.parentName}</div>
          <div><strong>Joules:</strong> {child.joules || 0}</div>
          <div style={{marginTop:8}}>
            <strong>Child unique id:</strong> <code style={{padding:"2px 6px",borderRadius:6,background:"#f3f3f3"}}>{child.id}</code>
            <div style={{marginTop:8}} className="btn-row">
              <button className="btn" onClick={copyId}>Copy id</button>
              <button className="btn btn-ghost" onClick={()=>setShowBarcode(true)}>Show QR (optional)</button>
            </div>
          </div>
        </div>
      </div>

      {editing ? (
        <div className="form">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange}/>
          </label>
          <label>
            Change photo
            <input type="file" accept="image/*" onChange={uploadAvatar}/>
          </label>
          <label>
            Goals (separate with | )
            <input name="goals" value={form.goals} onChange={handleChange}/>
          </label>
          <label>
            Weekly goals (separate with | )
            <input name="weeklyGoals" value={form.weeklyGoals} onChange={handleChange}/>
          </label>
          <div className="btn-row">
            <button className="btn" onClick={save}>Save</button>
            <button className="btn btn-ghost" onClick={()=>setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h4>Goals</h4>
          <ul>{(child.goals||[]).length ? child.goals.map((g,i)=><li key={i}>{g}</li>) : <li>No goals set</li>}</ul>

          <h4>Weekly Goals</h4>
          <ul>{(child.weeklyGoals||[]).length ? child.weeklyGoals.map((g,i)=><li key={i}>{g}</li>) : <li>No weekly goals</li>}</ul>

          <div className="btn-row" style={{marginTop:12}}>
            <button className="btn" onClick={()=>setEditing(true)}>Edit profile</button>
          </div>
        </>
      )}

      {showBarcode && (
        <div className="barcode-modal">
          <div className="barcode-card">
            <h3>Child Barcode</h3>
            <p>Parent can scan this to see your child profile in parent portal (optional).</p>
            <QRCode value={JSON.stringify({ id: child.id })} size={200} />
            <div className="btn-row" style={{marginTop:12}}>
              <button className="btn" onClick={()=>setShowBarcode(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="btn-row" style={{marginTop:12}}>
        <button className="btn btn-ghost" onClick={()=>{localStorage.removeItem("hj_current_child"); nav("/");}}>Logout</button>
      </div>
    </div>
  );
}

