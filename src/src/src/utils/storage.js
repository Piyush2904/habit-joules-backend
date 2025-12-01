// helper utility for localStorage data handling
export function getChildren() {
  try {
    const raw = localStorage.getItem("hj_children");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChildren(children) {
  localStorage.setItem("hj_children", JSON.stringify(children));
}

export function getParents() {
  try {
    const raw = localStorage.getItem("hj_parents");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveParents(parents) {
  localStorage.setItem("hj_parents", JSON.stringify(parents));
}
