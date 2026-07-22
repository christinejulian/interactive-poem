/* ==========================================================================
   GAME STATE
   ========================================================================== */
let currentLevel = 1;
const maxLevel = 15;
let score = 0;

/* Level score targets */
const levelTargets = {};
for (let i = 1; i <= maxLevel; i++) {
  levelTargets[i] = i * 10; // Level 1 = 10 points, Level 15 = 150 points
}

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const menuScreen = document.getElementById("menuScreen");
const characterSelect = document.getElementById("characterSelect");
const saveScreen = document.getElementById("saveScreen");
const settingsOverlay = document.getElementById("settingsOverlay");
const creditsOverlay = document.getElementById("creditsOverlay");

const poemGrid = document.getElementById("poemGrid");

const scoreboard = document.getElementById("scoreboard");
const scoreValue = document.getElementById("scoreValue");
const levelValue = document.getElementById("levelValue");

const levelComplete = document.getElementById("levelComplete");
const gameComplete = document.getElementById("gameComplete");

const bgm = document.getElementById("bgm");
const voice = document.getElementById("voice");
const hitSfx = document.getElementById("hitSfx");

/* ==========================================================================
   MENU FUNCTIONS
   ========================================================================== */
function openCharacterSelect() {
  menuScreen.style.display = "none";
  characterSelect.style.display = "flex";
}

function openSaveSlots() {
  menuScreen.style.display = "none";
  saveScreen.style.display = "flex";
}

function chooseCharacter(name) {
  localStorage.setItem("character", name);
  startGame();
}

function loadSlot(slot) {
  alert("Loaded Slot " + slot);
  startGame();
}

function showCredits() {
  creditsOverlay.style.display = "block";
  voice.play();
  creditsOverlay.querySelector(".overlay-content").innerHTML = `
    <h2>Credits</h2>
    <p>Created by Christine Julian</p>
  `;
  setTimeout(() => {
    creditsOverlay.style.display = "none";
  }, 18000);
}

function showInstructions() {
  alert("Click poem words to gain score.\nReach the target score to complete each level.\nThere are 15 levels.\nPress ESC for settings and return to menu.");
}

function openSettings() {
  settingsOverlay.style.display = "flex";
}

function closeSettings() {
  settingsOverlay.style.display = "none";
}

/* ==========================================================================
   SETTINGS INPUTS
   ========================================================================== */
document.getElementById("crtRange").addEventListener("input", (e) => {
  document.body.style.opacity = e.target.value;
});

document.getElementById("glitchRange").addEventListener("input", (e) => {
  const title = document.querySelector(".menu-title");
  if (title) {
    title.style.animationDuration = (0.25 + (1 - e.target.value) * 0.5) + "s";
  }
});

document.getElementById("volumeRange").addEventListener("input", (e) => {
  bgm.volume = e.target.value;
});

/* ==========================================================================
   GAMEPLAY
   ========================================================================== */
function startGame() {
  currentLevel = 1;
  score = 0;

  menuScreen.style.display = "none";
  characterSelect.style.display = "none";
  saveScreen.style.display = "none";
  levelComplete.style.display = "none";
  gameComplete.style.display = "none";

  scoreboard.style.display = "flex";

  bgm.volume = 0.6;
  bgm.play();
  voice.play();

  loadLevel(currentLevel);
  updateScoreboard();
}

function loadLevel(level) {
  poemGrid.innerHTML = "";
  poemGrid.style.display = "grid";

  // Generate 10 words per level
  for (let i = 0; i < 10; i++) {
    const word = document.createElement("div");
    word.classList.add("poemWord");
    word.textContent = `word ${i + 1}`;

    word.addEventListener("click", () => {
      score++;
      updateScoreboard();
      hitSfx.play();
      word.style.opacity = "0";
      word.style.transform = "scale(0.5)";
      word.style.pointerEvents = "none";

      if (score >= levelTargets[currentLevel]) {
        completeLevel();
      }
    });

    poemGrid.appendChild(word);
  }
}

function updateScoreboard() {
  scoreValue.textContent = score;
  levelValue.textContent = currentLevel;
}

function completeLevel() {
  poemGrid.style.display = "none";
  bgm.pause();

  if (currentLevel < maxLevel) {
    levelComplete.style.display = "flex";
    levelComplete.querySelector("h1").textContent = `Level ${currentLevel} Complete!`;

    const nextBtn = levelComplete.querySelector(".nextLevelBtn");
    nextBtn.onclick = () => {
      currentLevel++;
      score = 0;
      levelComplete.style.display = "none";
      scoreboard.style.display = "flex";
      bgm.play();
      loadLevel(currentLevel);
      updateScoreboard();
    };

  } else {
    gameComplete.style.display = "flex";
  }
}

function replayGame() {
  currentLevel = 1;
  score = 0;
  gameComplete.style.display = "none";
  scoreboard.style.display = "flex";
  bgm.play();
  loadLevel(currentLevel);
  updateScoreboard();
}

function returnToMenu() {
  poemGrid.style.display = "none";
  levelComplete.style.display = "none";
  gameComplete.style.display = "none";

  menuScreen.style.display = "flex";

  bgm.pause();
  bgm.currentTime = 0;
}

/* ==========================================================================
   KEYBOARD SHORTCUTS
   ========================================================================== */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    openSettings();
  }
});
