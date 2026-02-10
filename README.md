# LinkedIn Engagement Hider

A chrome extention to hide reaction counts, impressions, and vanity metrics on LinkedIn. Focus on creating content, not counting engagement.

## Features

**Hides:**
- Reaction counts (likes, celebrates, supports)
- Impression/view counts on posts and comments
- Comment and repost counts
- Analytics buttons and stats
- Profile viewer counts in sidebar
- Reactors facepile (profile pictures of who reacted)

**Notifications:**
- Hides reaction and impression notifications
- Keeps comment notifications (so you can reply)

## Installation

1. Download ZIP or clone this repo
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top-right)
4. Click "Load unpacked"
5. Select the extension folder
6. Refresh LinkedIn

## Known Bug

**Notification filtering doesn't work when navigating between pages** (e.g., Home → Network → Notifications).

**Workaround:** Refresh the page when on notifications (Cmd+Shift+R).

**Looking for a fix?** The issue is in `content.js` - notifications don't load consistently during SPA navigation. If you solve it, please submit a PR!

## Privacy

- Runs only on LinkedIn
- No data collection
- No external servers
- Everything happens locally

## License

MIT
