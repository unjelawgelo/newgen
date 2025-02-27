document.addEventListener("DOMContentLoaded", () => {
    const bgMusic = document.getElementById("bgMusic");
    const musicBars = document.getElementById("musicBars");

    // Check if music was playing before
    const wasMusicPlaying = localStorage.getItem("musicPlaying") === "true";
    const savedTime = parseFloat(localStorage.getItem("musicTime")) || 0;

    // Function to toggle play/pause
    function togglePlay() {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBars.classList.remove("paused");
            localStorage.setItem("musicPlaying", "true");
        } else {
            bgMusic.pause();
            musicBars.classList.add("paused");
            localStorage.setItem("musicPlaying", "false");
        }
    }

    // Auto-play music if it was playing before
    const playMusic = async () => {
        try {
            if (wasMusicPlaying) {
                bgMusic.currentTime = savedTime; // Restore previous time
                await bgMusic.play();
                musicBars.classList.remove("paused");
            } else {
                musicBars.classList.add("paused");
            }
        } catch (err) {
            console.log("Auto-play prevented by browser");
            musicBars.classList.add("paused");
        }
    };
    playMusic();

    // Save playback position every second
    setInterval(() => {
        if (!bgMusic.paused) {
            localStorage.setItem("musicTime", bgMusic.currentTime);
        }
    }, 1000);

    // Event listeners
    musicBars.addEventListener("click", togglePlay);

    // Handle music ending
    bgMusic.addEventListener("ended", () => {
        musicBars.classList.add("paused");
        localStorage.setItem("musicPlaying", "false");
        localStorage.setItem("musicTime", "0"); // Reset time
    });

    // Initialize volume
    bgMusic.volume = 0.5;

    // Optional: Add keyboard controls
    document.addEventListener("keypress", (e) => {
        if (e.code === "Space") {
            e.preventDefault();
            togglePlay();
        }
    });

    // Handle visibility change
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            bgMusic.pause();
            musicBars.classList.add("paused");
        } else if (localStorage.getItem("musicPlaying") === "true") {
            bgMusic.play();
            musicBars.classList.remove("paused");
        }
    });
});
