import { Ticker } from "pixi.js";
import { Functions } from "./Functions";
import { loadLevels } from "./Levels";
import { Levels } from "./Models/Level";
import { LevelData } from "./Models/LevelData";

export class Game {

  app: any;
  designWidth: number;
  designHeight: number;

  preLoaded: boolean;
  gameLoaded: boolean;
  levels: Levels;
  characters: [];

  currentLevel: LevelData;
  currentLevelIndex: number;

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
    this.currentLevel = this.levels.data[this.currentLevelIndex];
  }

  showCurrentLevel() {
    this.currentLevel.background.show();
  }

  update() {
    this.currentLevel.background.update();
  }

  resizeView() {

    var ratio = Functions.calculateAspectRatioFit(this.designWidth, this.designHeight, window.innerWidth, window.innerHeight);
    let w = ratio.x;
    let h = ratio.y;

    this.app.renderer.view.style.width = w + "px";
    this.app.renderer.view.style.height = h + "px";
  }
}

// Global to game engine
var game : Game;

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

    //mainTicker.FPS  
    
    // Execute calls
    game.update();

  });
  mainTicker.start();

  // todo
}