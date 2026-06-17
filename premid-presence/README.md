# VibeCode FM - PreMiD Presence

This folder contains a custom Discord Rich Presence plugin for the [PreMiD browser extension](https://premid.app/).

## Setup Instructions

To get this custom presence to show up on your Discord profile:

1. **Get the PreMiD Extension & App:**
   - Install the PreMiD app on your computer and the extension in your browser from [premid.app](https://premid.app/).

2. **Create a Discord Application:**
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications).
   - Click **New Application** and name it something like `VibeCode FM` (this is what will show up next to "Playing" on Discord).
   - Copy the **Application ID** (Client ID).
   - Open `presence.ts` in this folder and replace `YOUR_DISCORD_CLIENT_ID_HERE` with your copied ID.

3. **Upload Rich Presence Assets (Optional but recommended):**
   - In the Developer Portal, go to **Rich Presence -> Art Assets**.
   - Upload an image and name it `logo` (this will be the large image on your profile).
   - Upload images named `play` and `pause` for the small status indicators.

4. **Load the Custom Presence:**
   - Open the PreMiD extension options in your browser.
   - Go to **Settings -> Advanced** and enable **Developer Mode**.
   - A new **Developer** tab will appear in the PreMiD extension menu.
   - Click on the **Developer** tab, click **Load Presence**, and select this `premid-presence` folder.

5. **Start Vibing:**
   - Refresh your VibeCode FM app (`localhost:5173`).
   - Play a station.
   - Check your Discord profile! It should now say "Playing VibeCode FM" along with the current station name.
