import { Levels, LevelData, LevelSprites } from "./Models/Level";
import { LevelsConfiguration } from "./Models/Configuration/LevelsConfiguration";
import { Background } from "./Models/Background";
import { AnimationSprites, AnimationSprite } from "./Models/AnimatedSprite";
import { AnimationSpritesConfiguration, AnimationSpriteConfiguration } from "./Models/Configuration/AnimationSpritesConfiguration";
import { CharactersConfiguration, CharacterConfiguration } from "./Models/Configuration/CharactersConfiguration";
import { Characters, Character } from "./Models/Character";

/** Loads the textures configuration file and parses it to a PIXI.Texture[] object */
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

/** Loads the levels configuration file and parses it to a Levels object */
export function loadLevels(app: PIXI.Application): Levels {
  let levels: Levels = new Levels();
  let levelData: LevelsConfiguration;

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

/** Loads the animated sprites configuration file and parses it to a AnimationSprites object */
export function loadAnimationSprites(caller: object, callback: CallableFunction): void {
  let animationSprites: AnimationSprites = new AnimationSprites();
  let animationData: AnimationSpritesConfiguration;

  let animationFiles: string[] = [];

  loadJSON('config/animationSprites.json', function (data: string) {
    animationData = JSON.parse(data) as AnimationSpritesConfiguration;
  });

  if (animationData == null) {
    throw new Error('Unable to load animation data.');
  }

  // Create Pixi loader
  const loader = new PIXI.Loader();

  for (let i = 0; i < animationData.sprites.length; i++) {
    let details: AnimationSpriteConfiguration = animationData.sprites[i];

    // Diagnostics
    console.info(`Loading ${details.name} ${details.file}`);

    // Keep track of all resources
    animationFiles.push(details.name);

    // Load data
    loader.add(details.name, details.file);
  }

  /** Callback that processes the loaded resources and adds them to the animatedSprites object */
  loader.load((loader: any, resources: any) => {

    for (let i = 0; i < animationFiles.length; i++) {
      let details: string = animationFiles[i];
      let sheet = resources[details].spritesheet;

      //
      let animationSprite: AnimationSprite = new AnimationSprite(sheet.data.meta.name);

      // Grab animations from sheet
      for (let j = 0; j < sheet.data.meta.animations.length; j++) {
        let animationKey = sheet.data.meta.animations[j];

        // Find all matching animation parts
        let framesIndex = [];
        for (let sheetKey in sheet._frameKeys) {
          if (
            sheet._frameKeys[sheetKey].startsWith(animationKey) &&
            sheet._frameKeys[sheetKey].length == animationKey.length + 8
          ) {
            framesIndex.push(sheet._frameKeys[sheetKey]);
          }
        }

        // Grab all frames that match the animation parts
        let frames = [];
        for (let frameKey in framesIndex) {
          frames.push(PIXI.Texture.from(framesIndex[frameKey]));
        }

        // Add the animation key
        animationSprite.addKey(animationKey);

        // Create the animated sprites
        let animatedSprites = new PIXI.AnimatedSprite(frames);
        animationSprite.addAnimation(animationKey, animatedSprites);
      }

      // Add the AnimationSprite to the AnimationSprites object
      animationSprites.sprites.push(animationSprite);
    }
  });

  /** Fatal error while loading resources */
  loader.onError.add((err: string) => {
    throw new Error(err);
  });

  /** When loading is complete, perform callback to inform dependent parts */
  loader.onComplete.add((loader: any, resources: any) => {
    callback(caller, animationSprites);
  });
}

/** Loads the characters */
export function loadCharacters(app: PIXI.Application, animationSprites: AnimationSprites): Characters {
  let characters: Characters = new Characters();
  let characterData: CharactersConfiguration;

  let animationFiles: string[] = [];

  loadJSON('config/characters.json', function (data: string) {
    characterData = JSON.parse(data) as CharactersConfiguration;
  });

  if (characterData == null) {
    throw new Error('Unable to load character data.');
  }

  for (let i = 0; i < characterData.characters.length; i++) {
    let details: CharacterConfiguration = characterData.characters[i];

    let animationSource;

    // TODO
    for (let j = 0; j < animationSprites.sprites.length; j++) {
      if (details.name == animationSprites.sprites[j].id) {
        animationSource = animationSprites.sprites[j];
        break;
      }
    }

    if (animationSource == null) {
      throw new Error(`Unable to load ${details.name}`);
    }

    // Create the character data
    let character = new Character(app.stage, characters.characters.length.toString(), details.name);
    character.setAnimationSource(animationSource);
    character.setAnimation(details.defaultAnimationKey);

    // Add to collection
    characters.characters.push(character);
  }

  return characters;
}