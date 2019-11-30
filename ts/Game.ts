import { Ticker } from "pixi.js";
import { Functions } from "./Functions";
import { loadLevels } from "./Levels";
import { Levels } from "./Models/Level";
import { LevelData } from "./Models/LevelData";
import { DrawText } from "./DrawText";

export class Game {

  app: PIXI.Application;
  designWidth: number;
  designHeight: number;

  preLoaded: boolean;
  gameLoaded: boolean;
  levels: Levels;
  characters: [];

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
      height: this.designHeight
    });

    // Resize the view
    this.app.renderer.resize(this.designWidth, this.designHeight);

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
    this.debugHelper = new DrawText(this.app.stage, '', 10, 50);
  }

  showCurrentLevel() {
    this.currentLevel.background.show();
  }

  update() {
    this.currentLevel.background.update();
  }

  resizeView() {
    // Calculate ratio to keep everything in sync with the design width & height
    var ratio = Functions.calculateAspectRatioFit(this.designWidth, this.designHeight, window.innerWidth, window.innerHeight);
    let w : Number = Math.round(ratio.x);
    let h : Number = Math.round(ratio.y);

    // Diagnostics
    if (this.debugHelper) {
      this.debugHelper.Text = `w:${w}, h:${h}, wiw:${window.innerWidth}, wih${window.innerHeight}`;
    }

    // Resize view
    this.app.renderer.view.style.width = w + "px";
    this.app.renderer.view.style.height = h + "px";
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