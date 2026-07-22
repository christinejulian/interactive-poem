/* ==========================================================================
   GAME STATE & DOM ELEMENT SELECTION
   ========================================================================== */
let currentLevel = 1;
const maxLevel = 5;

// UI Elements
const poemGrid = document.getElementById("poemGrid");
const gameOver = document.getElementById("gameOver");
const levelComplete = document.getElementById("levelComplete");

const menuScreen = document.getElementById("menuScreen");
const characterSelect = document.getElementById("characterSelect");
const saveScreen = document.getElementById("saveScreen");
const settingsOverlay = document.getElementById("settingsOverlay");
const creditsOverlay = document.getElementById("creditsOverlay");

// Audio
const bgm = document.getElementById("bgm");
const voice = document.getElementById("voice");
const hitSfx = document.getElementById("hitSfx");

/* ==========================================================================
   LEVEL WORD LISTS (5 LEVELS)
   ========================================================================== */
const levelWords = {
  1: ["whisper", "shadow", "memory", "echo", "silence", "dream"],
  2: ["fracture", "hollow", "pulse", "static", "ember", "solace"],
  3: ["tremor", "ashen", "cipher", "lumen", "rift", "shatter"],
  4: ["seraph", "gloom", "marrow", "veil", "tether", "spiral"],
  5: ["origin", "relic", "mythos", "astral", "infinite", "eternal"]
};

/* ==========================================================================
   MENU & NAVIGATION
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
  setTimeout(() => {
    creditsOverlay.style.display = "none";
  }, 18000);
}

function showInstructions() {
  alert("Click poem words to defeat them.\nClear all words to complete the level.\nThere are 5 levels.\nPress ESC for settings.");
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
   LEVEL & GAMEPLAY LOGIC
   ========================================================================== */
function startGame() {
  currentLevel = 1;
  menuScreen.style.display = "none";
  characterSelect.style.display = "none";
  saveScreen.style.display = "none";
  levelComplete.style.display = "none";
  gameOver.style.display = "none";

  loadLevel(currentLevel);

  bgm.volume = 0.6;
  bgm.play();
  voice.play();
}

function loadLevel(level) {
  poemGrid.innerHTML = ""; // Clear previous level
  poemGrid.style.display = "grid";

  const words = levelWords[level];

  words.forEach(word => {
    const div = document.createElement("div");
    div.classList.add("enemy");
    div.textContent = word;

    div.addEventListener("click", () => {
      div.style.opacity = "0";
      div.style.transform = "scale(0.5)";
      div.style.pointerEvents = "none";
      spawnParticles();
      hitSfx.play();
      checkLevelCompletion();
    });

    poemGrid.appendChild(div);
  });
}

function checkLevelCompletion() {
  const remaining = Array.from(poemGrid.children).filter(e => e.style.pointerEvents !== "none");

  if (remaining.length === 0) {
    completeLevel();
  }
}

function completeLevel() {
  poemGrid.style.display = "none";
  bgm.pause();
  levelComplete.style.display = "flex";

  // Update level complete text
  levelComplete.querySelector("h1").textContent = `Level ${currentLevel} Complete!`;

  // Update button behavior
  const replayBtn = levelComplete.querySelector("button:nth-child(3)");
  const menuBtn = levelComplete.querySelector("button:nth-child(4)");

  replayBtn.textContent = currentLevel < maxLevel ? "Next Level" : "Replay Game";

  replayBtn.onclick = () => {
    if (currentLevel < maxLevel) {
      currentLevel++;
      levelComplete.style.display = "none";
      bgm.play();
      loadLevel(currentLevel);
    } else {
      replayGame();
    }
  };

  menuBtn.onclick = returnToMenu;
}

function replayGame() {
  currentLevel = 1;
  levelComplete.style.display = "none";
  bgm.play();
  loadLevel(currentLevel);
}

function returnToMenu() {
  poemGrid.style.display = "none";
  levelComplete.style.display = "none";
  gameOver.style.display = "none";
  characterSelect.style.display = "none";
  saveScreen.style.display = "none";

  menuScreen.style.display = "flex";

  bgm.pause();
  bgm.currentTime = 0;
}

/* ==========================================================================
   PARTICLES & EFFECTS
   ========================================================================== */
function spawnParticles() {
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    const dx = (Math.random() * 400 - 200) + "px";
    const dy = (Math.random() * 400 - 200) + "px";
    p.style.setProperty("--dx", dx);
    p.style.setProperty("--dy", dy);
    p.style.left = (window.innerWidth / 2) + "px";
    p.style.top = (window.innerHeight / 2) + "px";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

/* ==========================================================================
   KEYBOARD SHORTCUTS
   ========================================================================== */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (creditsOverlay.style.display === "block") {
      creditsOverlay.style.display = "none";
    } else {
      openSettings();
    }
  }
});
