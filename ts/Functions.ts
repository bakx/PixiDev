import { Backgrounds, Background } from "./Models/Background";
import { BackgroundsConfig, BackgroundConfig, BackgroundSpritesConfig } from "./Models/Configuration/BackgroundsConfig";
import { AnimationSprites, AnimationSprite } from "./Models/AnimatedSprite";
import { AnimationSpritesConfig, AnimationSpriteConfig } from "./Models/Configuration/AnimationSpritesConfig";
import { Characters, Character } from "./Models/Character";
import { CharactersConfig, CharacterConfig } from "./Models/Configuration/CharactersConfig";
import { Levels, LevelData } from "./Models/Level";
import { LevelsConfig, LevelConfig, LevelCharacterConfig } from "./Models/Configuration/LevelsConfig";
import { Game } from "./Game";

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

/** Loads the backgrounds configuration file and parses it to a Backgrounds object */
export function loadBackgrounds(app: PIXI.Application): Backgrounds {
  let backgrounds: Backgrounds = new Backgrounds();
  let backgroundData: BackgroundsConfig;

  loadJSON('config/backgrounds.json', function (data: string) {
    backgroundData = JSON.parse(data);
  });

  if (backgroundData == null) {
    throw new Error('Unable to load backgrounds.');
  }

  for (let i = 0; i < backgroundData.data.length; i++) {
    let config: BackgroundConfig = backgroundData.data[i];

    // Prepare background
    let background: Background = new Background(config.name);

    for (let j = 0; j < config.sprites.length; j++) {
      let sprite = config.sprites[j] as BackgroundSpritesConfig;

      // Add sprite
      background.add(
        app.stage,
        sprite.file,
        sprite.width == null ? app.screen.width : app.screen.width,
        sprite.height == null ? app.screen.height : app.screen.height
      );

      // Set update parameters
      background.addUpdate(
        sprite.index, sprite.update.x, sprite.update.y);
    }

    // Initialize
    background.init();

    // Add to collection
    backgrounds.data.push(background);
  }

  return backgrounds;
}

/** Loads the animated sprites configuration file and parses it to a AnimationSprites object */
export function loadAnimationSprites(caller: object, callback: CallableFunction): void {
  let animationSprites: AnimationSprites = new AnimationSprites();
  let animationData: AnimationSpritesConfig;

  let animationFiles: string[] = [];

  loadJSON('config/animation_sprites.json', function (data: string) {
    animationData = JSON.parse(data) as AnimationSpritesConfig;
  });

  if (animationData == null) {
    throw new Error('Unable to load animation data.');
  }

  // Create Pixi loader
  const loader = new PIXI.Loader();

  for (let i = 0; i < animationData.data.length; i++) {
    let config: AnimationSpriteConfig = animationData.data[i];

    // Diagnostics
    console.info(`Loading ${config.name} ${config.file}`);

    // Keep track of all resources
    animationFiles.push(config.name);

    // Load data
    loader.add(config.name, config.file, config);
  }

  /** Callback that processes the loaded resources and adds them to the animatedSprites object */
  loader.load((loader: any, resources: any) => {

    for (let i = 0; i < animationFiles.length; i++) {
      let details: string = animationFiles[i];
      let sheet = resources[details].spritesheet;

      // Create animationSprite object
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
  loader.onComplete.add(() => {
    callback(caller, animationSprites);
  });
}

/** Loads the characters */
export function loadCharacters(app: PIXI.Application, game: Game): Characters {
  let characters: Characters = new Characters();
  let characterData: CharactersConfig;

  loadJSON('config/characters.json', function (data: string) {
    characterData = JSON.parse(data) as CharactersConfig;
  });

  if (characterData == null) {
    throw new Error('Unable to load character data.');
  }

  for (let i = 0; i < characterData.data.length; i++) {
    let config: CharacterConfig = characterData.data[i];

    let animationSource;

    // TODO  should this be a dictionary?
    for (let j = 0; j < game.animationSprites.sprites.length; j++) {
      if (config.name == game.animationSprites.sprites[j].id) {
        animationSource = game.animationSprites.sprites[j];
        break;
      }
    }

    if (animationSource == null) {
      throw new Error(`Unable to load ${config.name}`);
    }

    // Create the character data
    let character = new Character(app.stage, characters.data.length.toString(), config.name);
    character.setAnimationSource(animationSource);
    character.setAnimation(config.defaultAnimationKey);
    character.animationSpeed = config.defaultAnimationSpeed;

    // Add to collection
    characters.data.push(character);
  }

  return characters;
}

/** Loads the levels configuration file and parses it to a Levels object */
export function loadLevels(app: PIXI.Application, game: Game): Levels {
  let levels: Levels = new Levels();
  let levelData: LevelsConfig;

  loadJSON('config/levels.json', function (data: string) {
    levelData = JSON.parse(data);
  });

  if (levelData == null) {
    throw new Error('Unable to load levels.');
  }

  for (let i = 0; i < levelData.data.length; i++) {
    let config: LevelConfig = levelData.data[i];

    // Create level object
    let level = new LevelData();

    //
    // Set background
    //

    let backgroundSource: Background;

    // TODO, there must be a more efficient way for this  .. Dictionary?
    for (let j = 0; j < game.backgrounds.data.length; j++) {
      if (config.background == game.backgrounds.data[j].name) {
        backgroundSource = game.backgrounds.data[j];
        break;
      }
    }

    if (backgroundSource == null) {
      throw new Error(`Unable to load background ${config.background} for level ${config.name}`);
    }

    level.background = backgroundSource;

    // Initialize the background
    level.background.init();

    //
    // Set Characters
    //

    level.characters = [];

    for (let j = 0; j < config.characters.length; j++) {
      let levelCharacterConfig: LevelCharacterConfig = config.characters[j];
      let characterSource: Character;

      for (let k = 0; k < game.characters.data.length; k++) {
        if (levelCharacterConfig.name == game.characters.data[k].name) {
          characterSource = game.characters.data[k];
          break;
        }
      }

      if (characterSource == null) {
        throw new Error(`Unable to load character ${config.background} for level ${config.name}`);
      }

      // Set additional character properties
      characterSource.x = levelCharacterConfig.position.x;
      characterSource.y = levelCharacterConfig.position.y;
      characterSource.addStage();

      level.characters.push(characterSource);
    }

    // Add to collection
    levels.data.push(level);
  }

  return levels;
}