const testMode = false;

document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const startBtn = document.getElementById("start-btn");
    const countdownScreen = document.getElementById("countdown-screen");
    const timerEl = document.getElementById("timer");
    const container = document.getElementById("container");

    // Show start screen initially
    startScreen.style.display = "block";
    countdownScreen.style.display = "none";
    container.style.display = "none";

    // Start button functionality
    startBtn.addEventListener("click", () => {
        startScreen.style.display = "none"; // Hide the start screen
        countdownScreen.style.display = "block"; // Show countdown screen

        if (testMode) {
            countdownScreen.style.display = "none";
            container.style.display = "block";
            initBirthdaySite();
            return;
        }

        const targetTime = new Date();
        targetTime.setHours(24, 0, 0, 0);

        const offset = 8 * 60;
        const localOffset = new Date().getTimezoneOffset();
        const diff = offset + localOffset;
        targetTime.setMinutes(targetTime.getMinutes() + diff);

        const updateTimer = () => {
            const now = new Date();
            const timeDiff = targetTime - now;

            if (timeDiff <= 0) {
                clearInterval(timerInterval);
                location.reload(); // Refresh the page when the timer is met
                return;
            }

            const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
            const seconds = Math.floor((timeDiff / 1000) % 60);

            timerEl.textContent = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
    });
});

function initBirthdaySite() {
    const sections = document.querySelectorAll("#container > div");
    let currentIndex = 0;

    sections[currentIndex].classList.add("active");

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    sections[currentIndex].appendChild(nextButton);

    const audio = new Audio("bg-bday.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    // Play birthday music on the first section
    if (sections[currentIndex].classList.contains("happy-birthday")) {
        audio.play().catch(err => console.log("Autoplay blocked:", err));
    }

    nextButton.addEventListener("click", () => {
        // Fade out current section
        sections[currentIndex].classList.add("fade-out");

        // Pause audio and reset for happy-birthday section
        if (sections[currentIndex].classList.contains("happy-birthday")) {
            audio.pause();
            audio.currentTime = 0;
        }

        setTimeout(() => {
            sections[currentIndex].classList.remove("active", "fade-out");
            currentIndex++;

            if (currentIndex < sections.length) {
                sections[currentIndex].classList.add("active");

                // Fade in the new section
                sections[currentIndex].classList.add("fade-in");
                nextButton.style.display = "block";
                sections[currentIndex].appendChild(nextButton);

                if (sections[currentIndex].classList.contains("happy-birthday")) {
                    audio.play().catch(err => console.log("Autoplay blocked:", err));
                }

                // Play bg-message.mp3 when reaching the last page (birthday-message)
                if (sections[currentIndex].classList.contains("birthday-message")) {
                    const lastSectionAudio = new Audio("bg-message.mp3");
                    lastSectionAudio.volume = 0.5;
                    lastSectionAudio.play().catch(err => console.log("Autoplay blocked:", err));
                    nextButton.style.display = "none"; // Hide the button on the last page
                }
            }
        }, 500);
    });
}


