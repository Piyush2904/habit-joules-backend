import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getParents, saveParents, getChildren } from "../utils/storage";

export default function ParentForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [childIdInput, setChildIdInput] = useState("");
  const [linkedChildId, setLinkedChildId] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function findChildById() {
    if (!childIdInput) {
      alert("Please enter the child's id.");
      return;
    }
    const all = getChildren();
    const found = all.find((c) => c.id === childIdInput.trim());
    if (!found) {
      alert("No child found with that id. Please check and try again.");
      setLinkedChildId(null);
      return;
    }
    setLinkedChildId(found.id);
    alert(`Found child: ${found.name}. You can now create your parent account to link them.`);
  }

  function createParent(e) {
    e.preventDefault();
    if (!form.name) {
      alert("Please enter your name");
      return;
    }
    const parents = getParents();
    const parent = { id: Date.now().toString(), ...form, linkedChildId: linkedChildId || null };
    parents.push(parent);
    saveParents(parents);
    localStorage.setItem("hj_current_parent", parent.id);
    nav("/parent-dashboard");
  }

  return (
    <div className="card">
      <h2>Parent Login / Register</h2>
      <p>Enter your info and the child's unique id (they can copy it from their Profile screen).</p>

      <div className="form">
        <label>
          Child's unique id
          <input
            placeholder="paste child id here"
            value={childIdInput}
            onChange={(e) => setChildIdInput(e.target.value)}
          />
        </label>

        <div className="btn-row">
          <button type="button" className="btn" onClick={findChildById}>
            Find child by id
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setChildIdInput("");
              setLinkedChildId(null);
            }}
          >
            Clear
          </button>
        </div>

        {linkedChildId && (
          <div style={{ marginTop: 8 }}>
            Linked child id: <code>{linkedChildId}</code>
          </div>
        )}

        <hr style={{ marginTop: 12, marginBottom: 12 }} />

        <label>
          Your name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>

        <label>
          Phone number
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>

        <div className="btn-row">
          <button className="btn" onClick={createParent}>
            Create / Login
          </button>
        </div>
      </div>
    </div>
  );
}
