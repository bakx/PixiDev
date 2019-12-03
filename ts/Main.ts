import { Game } from "./Game";
import { Ticker } from "pixi.js";

export class Main {

  // Global to game engine
  game: Game = new Game();

  constructor() {
  }

  async startGame() {
    // Initialize game settings
    await this.game.initialize();

    // Don't start the game engine
    this.game.stop();

    // Initialize game setup
    await this.game.setup();

    // Basic ticker to update game variables
    var mainTicker = new Ticker();
    mainTicker.add((data) => {

      // Update FPS counter
      this.game.fpsCounter.Text = `FPS: ${Math.round(mainTicker.FPS)}`;

      // Execute calls
      this.game.update();

    });

    mainTicker.start();
  }
}

// Global to game engine
var mainGame: Main;
mainGame = new Main();

// Start the game engine when the dom is loaded
window.addEventListener('load', function () {
  mainGame.startGame();
});

// Resize the screen when the window is resized
window.onresize = function () {
  if (mainGame !== null) {
    mainGame.game.resizeView();
  }
};

window.onorientationchange = function () {
  if (mainGame !== null) {
    mainGame.game.resizeView();
  }
};