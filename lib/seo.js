// Page titles for search results. Google shows about 60 characters, so a title is chosen from a list of
// wordings, longest first, and the first one that fits (with the site name added) is used. If none fits with
// the site name, the first that fits without it is used.
const BRAND = ' | MathSetu';
export function fit(...variants) {
  const v = variants.filter(Boolean);
  for (const t of v) if ((t + BRAND).length <= 60) return t;
  const bare = v.find(t => t.length <= 60);
  return { absolute: bare || v[v.length - 1] };
}
