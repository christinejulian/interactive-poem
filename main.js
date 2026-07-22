/* ==========================================================================
   GAME STATE & DOM ELEMENT SELECTION
   ========================================================================== */
let health = 100;

// UI & Container Elements
const healthFill = document.getElementById("healthFill");
const poemGrid = document.getElementById("poemGrid");
const enemies = document.querySelectorAll(".enemy");
const gameOver = document.getElementById("gameOver");
const levelComplete = document.getElementById("levelComplete");

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
  alert("Poem words are enemies.\nClick them to defeat.\nFinish all words to complete the level.\nPress ESC for settings.");  
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
   GAMEPLAY & REPLAY LOGIC
   ========================================================================== */
function resetEnemies() {
  enemies.forEach((enemy) => {
    enemy.style.opacity = "1";
    enemy.style.transform = "scale(1)";
    enemy.style.pointerEvents = "auto";
  });
}

function startGame() {  
  menuScreen.style.display = "none";
  characterSelect.style.display = "none";  
  saveScreen.style.display = "none";  
  levelComplete.style.display = "none";

  poemGrid.style.display = "grid";  

  health = 100;  
  updateHealth();  
  
  bgm.volume = 0.6;  
  bgm.play();  
  voice.play();  
}  

function replayGame() {
  resetEnemies();
  gameOver.style.display = "none";
  levelComplete.style.display = "none";
  startGame();
}

function returnToMenu() {
  resetEnemies();
  poemGrid.style.display = "none";
  gameOver.style.display = "none";
  levelComplete.style.display = "none";
  characterSelect.style.display = "none";
  saveScreen.style.display = "none";
  
  menuScreen.style.display = "flex";
  
  bgm.pause();
  bgm.currentTime = 0;
}

/* ==========================================================================
   HEALTH SYSTEM (still here in case you want future mechanics)
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

/* ==========================================================================
   ENEMY CLICK HANDLERS
   ========================================================================== */
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
    finishLevel();
  }  
}

function finishLevel() {
  poemGrid.style.display = "none";
  bgm.pause();
  levelComplete.style.display = "flex";
}

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

document.addEventListener("keydown", (e) => {  
  if (e.key === "Escape") {  
    if (creditsOverlay.style.display === "block") {  
      creditsOverlay.style.display = "none";  
    } else {  
      openSettings();  
    }  
  }  
});
