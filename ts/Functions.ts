import { Game } from "./Game";
import { AnimationSprite, AnimationSprites, AnimationDetails } from "./Models/AnimatedSprite";
import { Background, Backgrounds } from "./Models/Background";
import { Character, Characters } from "./Models/Character";
import { AnimationSpriteConfig, AnimationSpritesConfig } from "./Models/Configuration/AnimationSpritesConfig";
import { BackgroundConfig, BackgroundsConfig, BackgroundSpritesConfig } from "./Models/Configuration/BackgroundsConfig";
import { CharacterConfig, CharactersConfig, CharacterAnimationDetailsConfig } from "./Models/Configuration/CharactersConfig";
import { LevelCharacterConfig, LevelConfig, LevelsConfig } from "./Models/Configuration/LevelsConfig";
import { LevelData, Levels } from "./Models/Level";

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
    throw new Error('Unable to load backgrounds');
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
    backgrounds.data.set(config.name, background);
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
      animationSprites.data.set(sheet.data.meta.name, animationSprite);
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
    throw new Error('Unable to load character data');
  }

  for (let i = 0; i < characterData.data.length; i++) {
    let config: CharacterConfig = characterData.data[i];
    let animationSource: AnimationSprite;

    // Set animation source
    if (game.animationSprites.data.has(config.id)) {
      animationSource = game.animationSprites.data.get(config.id);
    }
    else {
      throw new Error(`Unable to load animation source ${config.id}`);
    }

    // Create the character data
    let character = new Character(config.id);

    // Set animation data
    character.animationSource = animationSource;
    character.defaultAnimationKey = config.defaultAnimationKey;
    character.defaultAnimationSpeed = config.defaultAnimationSpeed;

    // Create animation details
    character.animationDetails = new Map<string, AnimationDetails>();

    // Prepare animation details
    for (let j = 0; j < config.animationDetails.length; j++) {
      let animationDetailsData: CharacterAnimationDetailsConfig = config.animationDetails[j];
      let details: AnimationDetails = new AnimationDetails();

      details.animationSpeed = animationDetailsData.overrides.animationSpeed;
      details.loop = animationDetailsData.overrides.loop;

      character.animationDetails.set(animationDetailsData.key, details);
    }

    // Add to collection
    characters.data.set(config.id, character);
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
    throw new Error('Unable to load levels');
  }

  for (let i = 0; i < levelData.data.length; i++) {
    let config: LevelConfig = levelData.data[i];

    // Create level object

    let level = new LevelData();
    level.config = config;

    // Set background
    if (game.backgrounds.data.has(config.background)) {
      level.background = game.backgrounds.data.get(config.background);
      level.background.init();
    }
    else {
      throw new Error(`Unable to load background ${config.background} for level ${config.name}`);
    }

    // Load Characters

    level.characters = [];

    for (let j = 0; j < config.characters.length; j++) {
      let levelCharacterConfig: LevelCharacterConfig = config.characters[j];
      let character: Character;

      if (game.characters.data.has(levelCharacterConfig.sprite)) {
        let characterSource: Character = game.characters.data.get(levelCharacterConfig.sprite);

        // Clone the original character
        character = new Character(levelCharacterConfig.id);

        // Set level character properties 
        character.animationSource = characterSource.animationSource;
        character.animationDetails = characterSource.animationDetails;
        character.animationKey = levelCharacterConfig.animationKey;
        character.animationSpeed = levelCharacterConfig.animationSpeed;        
        character.position.x = levelCharacterConfig.position.x;
        character.position.y = levelCharacterConfig.position.y;

        // Set stage
        character.stage = app.stage;

        // Create the animation
        character.createAnimation(character.animationKey);
      }
      else {
        throw new Error(`Unable to load character ${levelCharacterConfig.id} for level ${config.name}`);
      }

      level.characters.push(character);
    }

    // Add to collection
    levels.data.push(level);
  }

  return levels;
}