# Pugh Chart App

Lightweight Pugh chart for group project evaluation. Each member scores projects against weighted criteria, and the app aggregates and ranks the results.

## Quick start (3 steps)

### 1. Install dependencies (one time only)

Make sure you have [Node.js](https://nodejs.org) installed, then open a terminal in this folder and run:

```bash
npm install
```

### 2. Start the server

```bash
npm start
```

You'll see: `Pugh chart app running at http://localhost:3000`

### 3. Share it with ngrok

Open a **second terminal** in this folder and run:

```bash
npm run tunnel
```

This uses [ngrok](https://ngrok.com) to create a public URL. The first time it runs, npx will download ngrok automatically. You'll see output like:

```
Forwarding   https://ab12-34-56-78.ngrok-free.app -> http://localhost:3000
```

**Send that `https://...ngrok-free.app` link to your group.** That's it -- anyone with the link can open the Pugh chart in their browser.

> **Note:** The first time someone opens the ngrok link, they may see a "Visit Site" interstitial page from ngrok. Just click through it. This is normal on the free tier.

## What you need running

You need **two terminal windows** open side by side:

| Terminal 1 | Terminal 2 |
|---|---|
| `npm start` (the server) | `npm run tunnel` (the public URL) |

Both must stay running while people are using the app. When you're done, press `Ctrl+C` in each terminal to stop them.

## How to use

- **Fill out chart** tab: Enter your name, score each project (+1 / 0 / −1) on each criterion, then click **Save my scores**. You can re-submit to update.
- **Weights**: Edit the weight row (values 0–1, must sum to 1.00) and click **Save weights**. Weights are shared by the group.
- **Add criteria/projects**: Use the form at the bottom. Everyone sees the same list.
- **View aggregate** tab: Shows the average score per criterion across all members, with a final weighted score and ranking.

## Data

All data is stored in the `data/` folder as JSON files. To reset everything, just delete the `data/` folder and restart the server.
