// Featured first. Array.prototype.sort is stable, so the order inside each group is kept.
export function sortProjects(list) {
  return [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
}
