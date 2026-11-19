# Feedback tracker

From the user-testing session with AJ, plus Charlotte's notes. ✅ done · 🟡 partly / needs a real-world check · ⬜ open

## UI / styling
- ✅ Dropdowns styled to match the site, with even padding on both sides and a custom chevron.
- 🟡 Mobile: layout checked at phone width (no sideways scrolling; story cards swipe). Still needs a test on a real phone, including the Spotify login redirect and the Share button.

## Copy & branding
- ✅ Tighter wording throughout.
- ✅ AI-agnostic: no AI company names in the interface ("AI curator", "Curator's picks", "Curator notes").
- ✅ "World tour" is now "Around the world", with a one-line description under the grouping chips.
- ✅ Length shows units: "songs" / "hours" labels, plus "3 hours ≈ 52 songs".

## Onboarding
- ✅ Heads-up at the top: real play counts need the Spotify data export, which takes days; everything else works now.
- ✅ The two sources are explained (Monthly playlists vs. Custom mix).
- ✅ Spotify Client ID: guests on the owner's list connect in one click; anyone else uses their own app. (Spotify still caps Development Mode at 5 guests; going fully public needs Spotify's extended quota, which requires a registered business with about 250k monthly users.)

## Core workflow
- ✅ Touchless AI step: one click with a guest passcode (owner's key, server-side) or the visitor's own key. Copy and paste remains as "Do it by hand".
- ✅ Swappable brain: `/api/curate` with Anthropic, Ollama (self-hosted) and mock providers.
- 🟡 Needs a real run on Vercel with the owner's key: one 300-song run should finish within Vercel's 5-minute function limit.

## Results page
- ✅ Story cards and stats moved above the song list.
- ✅ Tick sets to save only some of them, or save any single set as its own playlist.
- ✅ Genre fix: "R&B & Hip-Hop" split into "R&B & Soul" and "Hip-Hop & Rap" (Ariana Grande and Ayra Starr now land in R&B & Soul). Remaining odd calls come from MusicBrainz tags, and the AI pass corrects them.
- ✅ Share button on each card (shows where the device supports sharing, i.e. phones).
- ✅ Kept the older-songs flag in "Only new releases".
- ✅ Tier list: every cover now has its artist name.
- ✅ Album limit (Charlotte): "Songs per album: up to 3" by default; most-played with listening history, otherwise the curator's picks.

## Testing to-do
- ✅ Custom mix from ordinarily named playlists (demo data): works, including length in hours.
- ⬜ Real phone test.
- ⬜ Second user's Spotify account (add them under User Management first).

## Future
- ⬜ Video cards with audio snippets. Constraint: Spotify no longer gives new apps 30-second preview clips, so audio would need another licensed source, or a video built around the Spotify embed player. Needs research.
- ⬜ Fashion version: see `FASHION_PARALLELS.md`.
