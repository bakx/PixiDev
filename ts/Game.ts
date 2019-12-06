import { loadAnimationSprites, loadBackgrounds, loadCharacters, loadLevels } from "./Functions";
import { AnimationSprites } from "./Models/AnimatedSprite";
import { Backgrounds } from "./Models/Background";
import { Characters } from "./Models/Character";
import { DrawText } from "./Models/DrawText";
import { LevelData, Levels } from "./Models/Level";

export class Game {

  /** Application specific variables */
  app: PIXI.Application;
  designWidth: number;
  designHeight: number;

  /** State related variables */
  gameState: GameState = GameState.LOADING;
  gameFrame: number = 0;

  /** Resources */
  backgrounds: Backgrounds;
  levels: Levels;
  animationSprites: AnimationSprites;
  characters: Characters;

  /** Level data */
  level: LevelData;
  levelIndex: number;

  /** Text */
  fpsCounter: DrawText;
  debugHelper: DrawText;

  /** Game constructor */
  constructor(width?: number, height?: number) {
    if (width) this.designWidth = width;
    if (height) this.designHeight = height;
  }

  /** Initialize the default game parameters */
  async initialize() {
    this.designWidth = this.designWidth || 1920;
    this.designHeight = this.designHeight || 1080;
    this.levelIndex = 0;

    this.app = new PIXI.Application({
      width: this.designWidth,
      height: this.designHeight,
    });
  }

  /** Sets up the game  the default game parameters */
  async setup() {
    // Add the view to the body
    document.body.appendChild(this.app.view);

    // Adapt to current view
    this.resizeView();

    // Initialize the AnimationSprites object
    this.animationSprites = new AnimationSprites();

    // Start loading resources
    this.gameLoader(GameLoadingState.BACKGROUNDS);
  }

  /** Callback function for the loading of animated sprites */
  setAnimationSprites(game: Game, data: AnimationSprites) {
    // Assign animation sprites to the game object
    game.animationSprites = data;

    // Load characters
    game.gameLoader(GameLoadingState.CHARACTERS);
  }

  gameLoader(state: GameLoadingState) {
    // Load backgrounds
    if (state === GameLoadingState.BACKGROUNDS) {
      // Load characters
      this.backgrounds = loadBackgrounds(this.app);

      // Move to next stage
      state = GameLoadingState.ANIMATIONSPRITES;
    }

    // Load animation sprites
    if (state === GameLoadingState.ANIMATIONSPRITES) {
      // Load animated sprites
      loadAnimationSprites(this, this.setAnimationSprites);
    }

    // Load animation sprites
    if (state === GameLoadingState.CHARACTERS) {
      // Load characters
      //this.characters = loadCharacters(this.app, this);

      // Move to next stage
      state = GameLoadingState.LEVELS;
    }

    // Level related
    if (state === GameLoadingState.LEVELS) {
      // Load level data
      this.levels = loadLevels(this.app, this);

      // Move to next stage
      state = GameLoadingState.OVERLAY;
    }

    if (state === GameLoadingState.OVERLAY) {
      // Create FPS counter
      this.fpsCounter = new DrawText(this.app.stage, '', 10, 10);

      // Create Debug text
      this.debugHelper = new DrawText(this.app.stage, '', 10, 30);

      // Move to next stage
      state = GameLoadingState.DONE;
    }

    // Finished loading
    if (state === GameLoadingState.DONE) {
      this.loadLevel();

      // Start game engine
      this.start();
    }
  }

  /** Loads all resources related to the `levelIndex`  */
  loadLevel() {
    if (this.level) {
      // Remove all characters from the stage
      this.level.characters.forEach(char => {
        char.removeStage()
      });

      // Hide current level
      this.level.background.hide();
    }

    // Validate that the level exists
    if (this.levels.data.length - 1 < this.levelIndex) {
      console.warn(`Level ${this.levelIndex} was not found. Resetting to level 0`);
      this.levelIndex = 0;
    }

    // Load characters
    this.level = this.levels.data[this.levelIndex];

    // Add all characters to the stage
    for (let i = 0; i < this.level.characters.length; i++) {
      let character = this.level.characters[i];

      character.x = this.level.config.characters[i].position.x;
      character.y = this.level.config.characters[i].position.y;

      character.addStage();
    }

    // Load background
    this.level.background.show();
  }

  /** Starts the game loop */
  start() {
    this.gameState = GameState.RUNNING;
    this.app.start();
  }

  /** Pauses the game loop */
  pause() {
    this.gameState = GameState.PAUSED;
    this.app.stop();
  }

  /** Stops the game loop */
  stop() {
    this.gameState = GameState.STOPPED;
    this.app.stop();
  }

  /** Main game loop that updates all entities */
  update() {
    if (this.gameState === GameState.RUNNING) {
      // Update the background
      this.level.background.update();

      // Update all characters
      this.level.characters.forEach(char => {
        char.update();
      })

      // Temporary debugging code
      if (this.gameFrame % 250 == 0) {
        this.levelIndex++;
        this.loadLevel();
      }

      // Update game frame
      this.gameFrame++;
    }
  }

  /** Resizes the viewport & renderer to match the screen */
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

export enum GameLoadingState {
  BACKGROUNDS,
  ANIMATIONSPRITES,
  CHARACTERS,
  LEVELS,
  LOADLEVEL,
  OVERLAY,
  DONE
}

export enum GameState {
  LOADING,
  MENU,
  PAUSED,
  STOPPED,
  RUNNING
}

