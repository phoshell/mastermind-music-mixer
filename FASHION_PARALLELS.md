# Fashion parallels

How each Mastermind Music Mixer feature would translate to a fashion/shopping version ("a Wrapped for your wardrobe"). Add a line whenever a feature ships.

## Data sources

| Music version | Fashion version |
|---|---|
| Spotify playlists via login (OAuth) | Connect a retailer account (e.g. Net-a-Porter, SSENSE) where an API or export exists |
| Spotify data export for real play counts (takes days) | Retailer "download my data" exports, or **scanning Gmail order receipts** (Gmail API, read-only, receipts only) |
| MusicBrainz open data for genres, countries, debut years | Brand metadata: house/designer, country of origin, founding year, price tier, category; product pages for color and material |
| ISRC original release dates (catching re-releases) | Product style codes to tell new-season pieces from restocks and archive resales |

## Features

| Music feature | Fashion version |
|---|---|
| Monthly playlists detected by name | Monthly purchases from order dates; "seasons" from the fashion calendar (SS/AW) |
| Custom mix from any playlists | Recap of any set: a trip, a capsule wardrobe, a wishlist |
| Only new releases vs. everything discovered | Only new-season pieces vs. everything bought (including vintage/resale) |
| Album limit (max songs per album) | Brand limit: don't let one bulk order of basics dominate the recap |
| Genre families (first pass, rules-based) | Aesthetic families: quiet luxury, Y2K, gorpcore, minimalism, romantic, tailoring… ("where your fashion lies") |
| AI curator (energy × brightness, scenes) | AI stylist: formality × boldness per piece, micro-aesthetics, outfit pairings |
| Sound map (energy × mood) | Style map: minimal ↔ maximal × casual ↔ formal, with product photos as the dots |
| Artist tier list (S–D) | Brand tier list by spend or by cost-per-wear |
| Under the radar / brand-new artists | Emerging designers, independent labels, first-collection brands |
| Niche finds (rarest genres) | Rare aesthetics or categories you bought into once |
| Global reach (artist countries) | Countries your wardrobe comes from |
| Oldest discovery | Oldest piece (vintage) or longest-held brand loyalty |
| Song of the year / underrated gem / instant classic | Purchase of the year / sleeper hit / future heirloom |
| Month-by-month cover timeline | Month-by-month product-image timeline (spending rhythm, seasonal spikes) |
| Story cards (Instagram) | Same cards with product imagery; a "wardrobe Wrapped" carousel |
| Save sets as playlists | Save aesthetic groups as shoppable boards or wishlists |

## Privacy notes for the fashion version

- Purchase data is more sensitive than listening data (spend, addresses, sizes). Keep processing in the user's own environment: in-browser like this tool, or inside their own Google account (Apps Script / Workspace) for Gmail receipts.
- Never store raw receipts server-side; only send product names/brands to the AI, never prices or addresses unless the user opts in.
- Spend totals should be opt-in and hideable on share cards.
