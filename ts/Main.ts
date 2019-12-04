import { Ticker } from "pixi.js";
import { Game, GameState } from "./Game";

export class Main {
  // Global to game engine
  game: Game = new Game();

  // Main ticker
  mainTicker: Ticker = new Ticker();

  /** Initializes the game and starts the loop */
  async startGame() {
    // Initialize game settings
    await this.game.initialize();

    // Don't start the game engine
    this.game.stop();

    // Initialize game setup
    await this.game.setup();

    // Basic ticker to update game variables
    this.mainTicker.add(() => {
      if (this.game.gameState === GameState.RUNNING) {

        // Update FPS counter
        this.game.fpsCounter.Text = `FPS: ${Math.round(this.mainTicker.FPS)}`;

        // Execute calls
        this.game.update();
      }
    });

    this.mainTicker.start();
  }
}

/** Global for the game engine */
var mainGame: Main;
mainGame = new Main();

/** Start the game engine when the dom is loaded */
window.addEventListener('load', function () {
  mainGame.startGame();
});

/** Resize the screen when the window is resized */
window.onresize = function () {
  if (mainGame !== null) {
    mainGame.game.resizeView();
  }
};

/** Resize the screen when the orientation is resized */
window.onorientationchange = function () {
  if (mainGame !== null) {
    mainGame.game.resizeView();
  }
};