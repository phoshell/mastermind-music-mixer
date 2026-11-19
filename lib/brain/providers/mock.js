// Mock provider: no AI, no cost. Echoes the first-pass draft back in the expected JSON shape.
// Handy for testing the full flow locally or demoing without a key.
export async function curate({ user }) {
  const sections = [];
  let cur = null;
  for (const line of String(user).split('\n')) {
    const h = line.match(/^## (.+)/);
    if (h) { cur = { title: h[1], note: 'Draft order (mock brain).', tracks: [] }; sections.push(cur); continue; }
    const m = line.match(/^(\d+)\. /);
    if (m && cur) cur.tracks.push(Number(m[1]));
  }
  const n = sections.flatMap((s) => s.tracks);
  return JSON.stringify({
    songs: n.map((i) => ({ n: i, scene: '', energy: 5, brightness: 5, mood: '', language: 'English', underground: false })),
    sections: sections.filter((s) => s.tracks.length),
    shoutouts: ['(Mock brain: connect a real AI provider for notes about your taste.)'],
    picks: { song_of_the_year: n[0] ?? 0, underrated_gem: n[1] ?? 0, instant_classic: n[2] ?? 0 },
  });
}
