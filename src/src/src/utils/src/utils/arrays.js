// small helper to pick random sample
export function sampleSize(array, n) {
  const copy = [...array];
  if (n >= copy.length) return copy;
  const out = [];
  for (let i=0;i<n;i++){
    const idx = Math.floor(Math.random()*copy.length);
    out.push(copy.splice(idx,1)[0]);
  }
  return out;
}
