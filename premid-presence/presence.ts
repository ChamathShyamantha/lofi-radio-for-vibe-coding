const presence = new Presence({
    clientId: "YOUR_DISCORD_CLIENT_ID_HERE" // Create an app at https://discord.com/developers/applications and put the Client ID here
});

presence.on("UpdateData", async () => {
    // VibeCode FM updates the document.title to reflect the playing status
    // Format: "🎵 station.name | VibeCode FM" or "⏸️ station.name | VibeCode FM"
    
    const isPlaying = document.title.startsWith("🎵");
    if (!isPlaying && !document.title.startsWith("⏸️")) {
        presence.clearActivity();
        return;
    }

    const titleParts = document.title.split(" | ");
    const stationAndStatus = titleParts[0];
    const stationName = stationAndStatus.replace(/🎵 |⏸️ /g, "");

    const activity: PresenceData = {
        details: `Listening to ${stationName}`,
        state: isPlaying ? "Vibing to Lofi" : "Paused",
        largeImageKey: "logo", // Upload an image named 'logo' to your Discord App's Rich Presence Assets
        smallImageKey: isPlaying ? "play" : "pause" // Optional: upload 'play' and 'pause' images
    };

    if (isPlaying) {
        // Only show elapsed time when actively playing
        activity.startTimestamp = Math.floor(Date.now() / 1000);
    }

    presence.setActivity(activity);
});
