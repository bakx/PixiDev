import { Ticker } from "pixi.js";
import { Background } from "./Backgrounds";
import { Levels } from "./levels"
import { calculateAspectRatioFit } from './Functions'

export class Game {

  app: any;
  designWidth: number;
  designHeight: number;

  preLoaded: boolean;
  gameLoaded: boolean;
  levels: Background[];
  characters: [];

  currentLevel: Background;
  currentLevelIndex: number;

  constructor(width?: number, height?: number) {
    if (width) this.designWidth = width;
    if (height) this.designHeight = height;
  }

  /** Initialize the default game parameters */
  initialize() {

    this.designWidth = this.designWidth || 1920;
    this.designHeight = this.designHeight || 1080;
    this.currentLevelIndex = 0;

    debugger;

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

    // //! This is wrong, should assign Level class where Backgrounds is just part of a Level.
    this.levels = Levels.loadLevels(this.app);
  }

  showCurrentLevel() {
    this.currentLevel = this.levels[game.currentLevelIndex];
    this.currentLevel.show();
  }

  update() {
    this.currentLevel.update();
  }

  resizeView() {

    var ratio = calculateAspectRatioFit(this.designWidth, this.designHeight, window.innerWidth, window.innerHeight);
    let w = ratio.width;
    let h = ratio.height;

    this.app.renderer.view.style.width = w + "px";
    this.app.renderer.view.style.height = h + "px";
  }
}

var game = new Game();
game.initialize();
game.showCurrentLevel();

var mainTicker = new Ticker();
mainTicker.add(() => {
  game.update();
});
mainTicker.start();


window.onresize = function () {
  game.resizeView();
};



//let animatedSprites = new AnimatedSprites("f");