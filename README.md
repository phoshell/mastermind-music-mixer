# Mastermind Music Mixer

Turn a year of playlists (or any playlists you choose) into one master mix, sequenced by genre and vibe, with a shareable recap of your year.

A Data Vedette project.

---

## How it works

1. **Connect Spotify.** Guests on the owner's list connect in one click. Anyone else can use their own free Spotify app.
2. **Pick your playlists.**
   - *Monthly playlists:* found automatically when names include a month and year (`3.26; Title`, `6/23 rara`, `Oct 2026`, `2026-10`). Names with no year aren't found.
   - *Custom mix:* tick any playlists, whatever their names (great for a mixtape).
   - *Only new releases* checks each song's original release date, so anniversary editions and remasters don't sneak in. Each flagged song can be kept individually.
3. **Shape your mix.**
   - Length: every song, a set number of songs, or a set number of hours.
   - Songs per album: if you saved a whole album, keep only your top tracks (most-played with listening history, otherwise the curator's favorites).
   - Journey shape, grouping and extra touches.
   - The AI curator runs in one click (guest passcode or your own AI key), or by hand in any AI chat.
4. **Your year in numbers.** Up to 8 Instagram Story cards (1080 × 1920) to download or share, plus stats, genre mix, curator notes and, with your Spotify data export, real listening time.
5. **Save to Spotify.** Save everything, only the sets you tick, or any single set as its own playlist.

> **Real play counts:** Spotify doesn't share them with apps. Request **Extended streaming history** at spotify.com → Account → Privacy settings. It takes a few days, so request it early. Everything else works immediately.

---

## Deploy (GitHub + Vercel)

The site is a single page (`index.html`) plus one small backend function (`api/curate.js`) that runs the AI step, so AI keys never sit in the browser.

1. **GitHub.** Create a repository (e.g. `mastermind-music-mixer`) and upload everything in this folder **except** `node_modules/` and any `.env` file (the included `.gitignore` handles this if you use git).
2. **Vercel.** At [vercel.com](https://vercel.com), sign in with GitHub → **Add New → Project** → import the repository → **Deploy**. No build settings needed.
3. **Environment variables** (Vercel → Project → Settings → Environment Variables), then redeploy:

   | Name | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | Your Anthropic API key (server-side only) |
   | `DEMO_PASSCODE` | The passcode you give guests; they run on your key |
   | `BRAIN_PROVIDER` | `anthropic` (default), `ollama` (self-hosted) or `mock` (free test mode) |

4. **Spotify.** In your Spotify app (developer.spotify.com → your app → Settings):
   - Add your Vercel address (e.g. `https://mastermind-music-mixer.vercel.app/`) under **Redirect URIs**, exactly, with the trailing slash.
   - Under **User Management**, add each guest's Spotify email (Spotify allows 5 in Development Mode). Guests then connect in one click.

## The swappable AI "brain"

The page always calls `/api/curate`. Which AI answers is a server setting:

- `lib/brain/providers/anthropic.js`: Anthropic (current default)
- `lib/brain/providers/ollama.js`: any self-hosted model via Ollama
- `lib/brain/providers/mock.js`: no AI; returns the genre first pass (free, for testing and demos)

To add another provider, add a file exporting `curate({ system, user, schema, apiKey })` and register it in `lib/brain/index.js`. The front end doesn't change.

Visitors who bring their own key send it with that one request only; it is never stored or logged. Guests with the passcode run on the owner's key.

## Run it locally

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5178/. Without a `.env.local`, the free mock brain runs with passcode `demo`. To use the real AI locally, copy `.env.example` to `.env.local` and fill it in.

## Data & privacy

- Spotify login happens in the browser (PKCE, no client secret). Tokens stay in the browser.
- Genre tags, countries, release dates and debut years come from [MusicBrainz](https://musicbrainz.org) open data. Some energy/tempo hints come from ReccoBeats.
- Song titles and artist names are sent to the AI provider only when the curator runs.
- Listening-history files are read in the browser only.

Not affiliated with Spotify or MusicBrainz.
