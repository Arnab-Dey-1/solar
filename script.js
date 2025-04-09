// Basic script with audio control (no zoom-related changes needed)
document.addEventListener("DOMContentLoaded", () => {
    console.log("Solar System Loaded with Background Music!");

    // Handle audio autoplay restrictions
    const audio = document.querySelector("audio");
    let isFirstInteraction = true;

    document.body.addEventListener("click", () => {
        if (isFirstInteraction) {
            audio.play().then(() => {
                console.log("Audio started playing");
            }).catch(error => {
                console.log("Audio play failed:", error);
            });
            isFirstInteraction = false;
        }
    });
});
