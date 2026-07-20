/* ==========================================================================
   GAME STATE & DOM ELEMENT SELECTION
   ========================================================================== */
let health = 100;

// UI & Container Elements
const healthFill = document.getElementById("healthFill");
const boss = document.getElementById("boss");
const poemGrid = document.getElementById("poemGrid");
const enemies = document.querySelectorAll(".enemy");
const gameOver = document.getElementById("gameOver");

const menuScreen = document.getElementById("menuScreen");
const characterSelect = document.getElementById("characterSelect");
const saveScreen = document.getElementById("saveScreen");
const settingsOverlay = document.getElementById("settingsOverlay");
const creditsOverlay = document.getElementById("creditsOverlay");

// Audio Elements
const bgm = document.getElementById("bgm");
const voice = document.getElementById("voice");
const hitSfx = document.getElementById("hitSfx");

/* ==========================================================================
   NAVIGATION & MENU FUNCTIONS
   ========================================================================== */
function openCharacterSelect() {  
  menuScreen.style.display = "none";  
  characterSelect.style.display = "block";  
}  

function openSaveSlots() {  
  menuScreen.style.display = "none";  
  saveScreen.style.display = "block";  
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
  alert("Poem words are enemies.\nClick them to defeat.\nBoss appears after all words fall.\nHealth drops when boss attacks.\nPress ESC for settings.");  
}  

function openSettings() {  
  settingsOverlay.style.display = "flex";  
}  

function closeSettings() {  
  settingsOverlay.style.display = "none";  
}  

/* ==========================================================================
   SETTINGS INPUT EVENT LISTENERS
   ========================================================================== */
document.getElementById("crtRange").addEventListener("input", (e) => {  
  const val = e.target.value;  
  document.body.style.opacity = val;  
});  

document.getElementById("glitchRange").addEventListener("input", (e) => {  
  const val = e.target.value;  
  const title = document.querySelector(".menu-title");  
  if (title) {
    title.style.animationDuration = (0.25 + (1 - val) * 0.5) + "s";  
  }
});  

document.getElementById("volumeRange").addEventListener("input", (e) => {  
  bgm.volume = e.target.value;  
});  

/* ==========================================================================
   GAMEPLAY & REPLAY LOGIC
   ========================================================================== */
// Resets all defeated words back to their original state
function resetEnemies() {
  enemies.forEach((enemy) => {
    enemy.style.opacity = "1";
    enemy.style.transform = "scale(1)";
    enemy.style.pointerEvents = "auto";
  });
}

// Starts a new game session
function startGame() {  
  menuScreen.style.display = "none";
  characterSelect.style.display = "none";  
  saveScreen.style.display = "none";  
  
  poemGrid.style.display = "grid";  
  boss.style.display = "none";  
  
  health = 100;  
  updateHealth();  
  
  bgm.volume = 0.6;  
  bgm.play();  
  voice.play();  
}  

// Replay action: resets grid, hides game over screen, and restarts
function replayGame() {
  resetEnemies();
  gameOver.style.display = "none";
  startGame();
}

// Menu action: resets state and returns to main menu screen
function returnToMenu() {
  resetEnemies();
  boss.style.display = "none";
  poemGrid.style.display = "none";
  gameOver.style.display = "none";
  characterSelect.style.display = "none";
  saveScreen.style.display = "none";
  
  menuScreen.style.display = "flex";
  
  bgm.pause();
  bgm.currentTime = 0;
}

/* ==========================================================================
   HEALTH & COMBAT MECHANICS
   ========================================================================== */
function updateHealth() {  
  healthFill.style.width = health + "%";  
  if (health <= 0) {  
    triggerGameOver();  
  }  
}  

function triggerGameOver() {  
  gameOver.style.display = "flex";  
  bgm.pause();  
}  

// Enemy click handlers
enemies.forEach((enemy) => {  
  enemy.addEventListener("click", () => {  
    enemy.style.opacity = "0";  
    enemy.style.transform = "scale(0.5)";  
    enemy.style.pointerEvents = "none";  
    spawnParticles();  
    hitSfx.play();  
    checkAllEnemiesDefeated();  
  });  
});  

function checkAllEnemiesDefeated() {  
  const remaining = Array.from(enemies).filter(e => e.style.pointerEvents !== "none");  
  if (remaining.length === 0) {  
    boss.style.display = "block";  
    voice.play();  
  }  
}  

// Periodic boss damage loop
setInterval(() => {  
  if (poemGrid.style.display === "grid" && boss.style.display === "block" && health > 0) {  
    health -= 10;  
    updateHealth();  
    spawnParticles();  
  }  
}, 3000);  

/* ==========================================================================
   VISUAL EFFECTS & KEYBOARD CONTROLS
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

// Keydown listeners for shortcuts
document.addEventListener("keydown", (e) => {  
  if (e.key === "Escape") {  
    if (creditsOverlay.style.display === "block") {  
      creditsOverlay.style.display = "none";  
    } else {  
      openSettings();  
    }  
  }  
});

