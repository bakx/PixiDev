import { Ticker } from "pixi.js";
import { DrawText } from "./Models/DrawText";
import { loadLevels } from "./Functions";
import { Levels } from "./Models/Level";
import { LevelData } from "./Models/LevelData";

export class Game {

  app: PIXI.Application;
  designWidth: number;
  designHeight: number;

  preLoaded: boolean;
  gameLoaded: boolean;
  levels: Levels;

  currentLevel: LevelData;
  currentLevelIndex: number;

  fpsCounter: DrawText;
  debugHelper: DrawText;

  constructor(width?: number, height?: number) {
    if (width) this.designWidth = width;
    if (height) this.designHeight = height;
  }

  /** Initialize the default game parameters */
  async initialize() {
    this.designWidth = this.designWidth || 1920;
    this.designHeight = this.designHeight || 1080;
    this.currentLevelIndex = 0;

    this.app = new PIXI.Application({
      width: this.designWidth,
      height: this.designHeight,
    });

    // Add the view to the body
    document.body.appendChild(this.app.view);

    // Adapt to current view
    this.resizeView();

    // Load level data
    this.levels = loadLevels(this.app);

    // Set current level
    this.currentLevel = this.levels.levels[this.currentLevelIndex];

    // Create FPS counter
    this.fpsCounter = new DrawText(this.app.stage, '', 10, 10);

    // Create Debug text
    this.debugHelper = new DrawText(this.app.stage, '', 10, 30);
  }

  showCurrentLevel() {
    this.currentLevel.background.show();
  }

  update() {
    this.currentLevel.background.update();
  }

  resizeView() {
    let width = window.innerWidth || document.body.clientWidth;
    let height = window.innerHeight || document.body.clientHeight;

    let ratio = height / this.designHeight;

    let view = this.app.renderer.view;
    view.style.height = this.designHeight * ratio + "px";

    var newWidth = (width / ratio);

    view.style.width = width + "px";

    this.app.renderer.resize(newWidth, this.designHeight);
  }
}

// Global to game engine
var game: Game;

// Start the game engine when the dom is loaded
window.addEventListener('load', function () {
  startGame();
});

// Resize the screen when the window is resized
window.onresize = function () {
  if (game !== null) {
    game.resizeView();
  }
};

window.onorientationchange = function () {
  if (game !== null) {
    game.resizeView();
  }
};

async function startGame() {
  // Create new game object
  game = new Game();

  // Initialize game settings
  await game.initialize();

  // Load level
  game.showCurrentLevel();

  // Basic ticker to update game variables
  var mainTicker = new Ticker();
  mainTicker.add((data) => {

    // Update FPS counter
    game.fpsCounter.Text = `FPS: ${Math.round(mainTicker.FPS)}`;

    // Execute calls
    game.update();

  });
  mainTicker.start();

  // todo
}