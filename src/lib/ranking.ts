export function rankLabel(index: number) {
  const n = index + 1;
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

export function rankTone(index: number) {
  if (index === 0) return "bg-amber-400 text-amber-950";
  if (index === 1) return "bg-slate-300 text-slate-800";
  if (index === 2) return "bg-orange-300 text-orange-950";
  return "bg-orange-50 text-orange-800";
}
