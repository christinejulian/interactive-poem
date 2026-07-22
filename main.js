// main.js

// ============================================================
// GAME CONSTANTS
// ============================================================
const MAX_STAGES = 15;
const DAMAGE_AMOUNT = 10; // 10% clarity loss
const SCORE_GOAL = 10;

let currentStage = 1;
let score = 0;
let clarity = 100;

let highestUnlocked = Number(localStorage.getItem("highestUnlocked")) || 1;

// ============================================================
// ELEMENTS
// ============================================================
const attractScreen = document.getElementById("attractScreen");
const menuScreen = document.getElementById("menuScreen");
const levelSelect = document.getElementById("levelSelect");
const poemGrid = document.getElementById("poemGrid");
const levelComplete = document.getElementById("levelComplete");
const gameOver = document.getElementById("gameOver");
const gameComplete = document.getElementById("gameComplete");
const settingsScreen = document.getElementById("settingsScreen");
const creditsOverlay = document.getElementById("creditsOverlay");

const scoreboard = document.getElementById("scoreboard");
const levelIndicator = document.getElementById("levelIndicator");
const scoreIndicator = document.getElementById("scoreIndicator");
const healthIndicator = document.getElementById("healthIndicator");

const levelGrid = document.getElementById("levelGrid");

// ============================================================
// BUTTONS
// ============================================================
const startGameBtn = document.getElementById("startGameBtn");
const howToPlayBtn = document.getElementById("howToPlayBtn");
const settingsBtn = document.getElementById("settingsBtn");

const returnMenuBtn = document.getElementById("returnMenuBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const retryLevelBtn = document.getElementById("retryLevelBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

const mainMenuBtn1 = document.getElementById("mainMenuBtn1");
const mainMenuBtn2 = document.getElementById("mainMenuBtn2");
const mainMenuBtn3 = document.getElementById("mainMenuBtn3");

const creditsMenuBtn = document.getElementById("creditsMenuBtn");
const settingsBackBtn = document.getElementById("settingsBackBtn");

// ============================================================
// SETTINGS + MUSIC
// ============================================================
const volumeSlider = document.getElementById("volumeSlider");
const bgMusic = document.getElementById("bgMusic");

volumeSlider.value = localStorage.getItem("volume") || 0.4;
bgMusic.volume = volumeSlider.value;

volumeSlider.oninput = () => {
    bgMusic.volume = volumeSlider.value;
    localStorage.setItem("volume", volumeSlider.value);
};

// ============================================================
// WORD BANK (neutral, cognitive theme)
// ============================================================
const words = [
    "focus","clarity","calm","present","aware",
    "steady","mindful","center","breathe","observe",
    "notice","attention","balance","still","clear",
    "reflect","listen","sense","soft","gentle"
];

// ============================================================
// ATTRACT MODE → EXIT ON KEY OR CLICK
// ============================================================
document.addEventListener("keydown", exitAttract, { once: true });
document.addEventListener("click", exitAttract, { once: true });

function exitAttract() {
    attractScreen.classList.remove("active");
    menuScreen.classList.add("active");
}

// ============================================================
// MENU BUTTONS
// ============================================================
startGameBtn.onclick = () => {
    hideAll();
    levelSelect.classList.add("active");
    buildStageButtons();
};

howToPlayBtn.onclick = () => {
    alert(
        "Correct words increase focus.\n" +
        "Wrong words overload your mind and reduce clarity by 10%.\n" +
        "If clarity reaches 0%, the session ends.\n\n" +
        "Complete all 15 stages to finish the training."
    );
};

settingsBtn.onclick = () => {
    hideAll();
    settingsScreen.classList.add("active");
};

returnMenuBtn.onclick = showMenu;
mainMenuBtn1.onclick = showMenu;
mainMenuBtn2.onclick = showMenu;
mainMenuBtn3.onclick = showMenu;
creditsMenuBtn.onclick = showMenu;
settingsBackBtn.onclick = showMenu;

// ============================================================
// BUILD STAGE SELECT GRID
// ============================================================
function buildStageButtons() {
    levelGrid.innerHTML = "";

    for (let i = 1; i <= MAX_STAGES; i++) {
        const b = document.createElement("button");
        b.textContent = "STAGE " + i;

        if (i <= highestUnlocked) {
            b.onclick = () => startStage(i);
        } else {
            b.disabled = true;
            b.textContent = "LOCKED";
        }

        levelGrid.appendChild(b);
    }
}

// ============================================================
// START STAGE
// ============================================================
function startStage(stage) {
    currentStage = stage;
    score = 0;
    clarity = 100;

    hideAll();

    scoreboard.style.display = "block";
    poemGrid.style.display = "grid";

    updateHUD();
    createWords();
}

// ============================================================
// UPDATE HUD
// ============================================================
function updateHUD() {
    levelIndicator.textContent = `STAGE ${currentStage} / ${MAX_STAGES}`;
    scoreIndicator.textContent = `FOCUS: ${score}`;
    healthIndicator.textContent = `CLARITY: ${clarity}%`;
}

// ============================================================
// CREATE WORD GRID
// ============================================================
function createWords() {
    poemGrid.innerHTML = "";

    const stageWords = [...words].sort(() => Math.random() - 0.5).slice(0, 10);

    stageWords.forEach(word => {
        const div = document.createElement("div");
        div.className = "poemWord";
        div.textContent = word;

        div.onclick = () => {
            const isCorrect = Math.random() > 0.3;

            if (isCorrect) {
                score++;
                div.style.opacity = 0.25;
                div.style.pointerEvents = "none";
            } else {
                div.classList.add("wrong");
                clarity -= DAMAGE_AMOUNT;
            }

            updateHUD();
            checkStage();
        };

        poemGrid.appendChild(div);
    });
}

// ============================================================
// CHECK STAGE STATUS
// ============================================================
function checkStage() {

    if (clarity <= 0) {
        hideAll();
        gameOver.classList.add("active");
        return;
    }

    if (score >= SCORE_GOAL) {

        if (currentStage > highestUnlocked) {
            highestUnlocked = currentStage;
            localStorage.setItem("highestUnlocked", highestUnlocked);
        }

        if (currentStage === MAX_STAGES) {
            creditsOverlay.style.display = "flex";

            setTimeout(() => {
                creditsOverlay.style.display = "none";
                hideAll();
                gameComplete.classList.add("active");
            }, 15000);

        } else {
            hideAll();
            document.getElementById("levelCompleteTitle").textContent =
                `STAGE ${currentStage} COMPLETE`;
            levelComplete.classList.add("active");
        }
    }
}

// ============================================================
// BUTTON ACTIONS
// ============================================================
nextLevelBtn.onclick = () => startStage(currentStage + 1);
retryLevelBtn.onclick = () => startStage(currentStage);
playAgainBtn.onclick = () => startStage(1);

// ============================================================
// SHOW MENU
// ============================================================
function showMenu() {
    hideAll();
    scoreboard.style.display = "none";
    creditsOverlay.style.display = "none";
    menuScreen.classList.add("active");
}

// ============================================================
// HIDE ALL SCREENS
// ============================================================
function hideAll() {
    attractScreen.classList.remove("active");
    menuScreen.classList.remove("active");
    levelSelect.classList.remove("active");
    poemGrid.style.display = "none";
    levelComplete.classList.remove("active");
    gameOver.classList.remove("active");
    gameComplete.classList.remove("active");
    settingsScreen.classList.remove("active");
    scoreboard.style.display = "none";
}

// ============================================================
// ESC KEY RETURNS TO MENU
// ============================================================
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") showMenu();
});

// ============================================================
// START IN ATTRACT MODE
// ============================================================
hideAll();
attractScreen.classList.add("active");
