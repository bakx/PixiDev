import { Point } from "pixi.js";
import { Levels } from "./Models/Level";
import { LevelData } from "./Models/LevelData";
import { Background } from "./Models/Background";
import { LevelSprites } from "./Models/LevelSprites";

/** */
export function loadTextures(sourceTemplateStart: number, sourceTemplateEnd: number, padding: number, start: number, end: number): PIXI.Texture[] {
  let textures: PIXI.Texture[] = [];
  for (let i = start; i < end; i++) {
    let texture = PIXI.Texture.from(
      `${sourceTemplateStart}${i.toString().padStart(padding, "0")}${sourceTemplateEnd}`
    );
    textures.push(texture);
  }

  return textures;
}

/** Calculates aspect ratio for resizing purposes */
export function getAspectRatio(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number): Point {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return new Point(srcWidth * ratio, srcHeight * ratio);
}

/**
 * Loads a local .json file and returns the contents of the file
 * to the callback function.
 *
 * @param {string} file Name of the file
 * @param {CallableFunction} callback Name of callback function
 */
export function loadJSON(file: string, callback: CallableFunction) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", file, false);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == 200) {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function loadLevels(app: PIXI.Application): Levels {
  let levels: Levels = new Levels();
  let levelData: Levels;

  loadJSON('config/levels.json', function (data: string) {
    levelData = JSON.parse(data);
  });

  if (levelData == null) {
    throw new Error('Unable to load levels.');
  }

  for (let i = 0; i < levelData.levels.length; i++) {
    let details: any = levelData.levels[i];

    // Set background for level
    let level = new LevelData();
    level.background = new Background(details.background.name);

    for (let j = 0; j < details.background.sprites.length; j++) {
      let sprite = details.background.sprites[j] as LevelSprites;

      // Add sprite
      level.background.add(
        app.stage,
        sprite.file,
        sprite.width == null ? app.screen.width : app.screen.width,
        sprite.height == null ? app.screen.height : app.screen.height
      );

      // Set update parameters
      level.background.addUpdate(
        sprite.index, sprite.update.x, sprite.update.y);
    }

    // Initialize
    level.background.init();

    // Add to collection
    levels.levels.push(level);
  }

  return levels;
}
