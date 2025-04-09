// Optional JavaScript for interactivity or initialization
document.addEventListener("DOMContentLoaded", () => {
    console.log("Solar System Loaded with Background Music!");

    // Example: Add ability to toggle audio (optional)
    const audio = document.querySelector("audio");
    document.body.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });
});
