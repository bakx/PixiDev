import { Functions } from "./Functions";
import { Background } from "./Models/Background";
import { Levels } from "./Models/Level";
import { LevelData } from "./Models/LevelData";

export function loadLevels(app: any): Levels {

    let levels: Levels = new Levels();
    let levelData: any;

    Functions.loadJSON('config/levels.json', function (data: string) {
        levelData = JSON.parse(data);
    });

    if (levelData == null) {
        throw new Error('Unable to load levels.');
    }

    for (let i = 0; i < levelData.levels.length; i++) {
        let details : any = levelData.levels[i];

        // Set background for level
        let level = new LevelData();
        level.background = new Background(details.background.name);

        for (let j = 0; j < details.background.sprites.length; j++) {
            let sprite = details.background.sprites[j];

            // Add sprite
            level.background.add(
                app.stage,
                sprite.file,
                sprite.width == null ? app.screen.width : app.screen.width,
                sprite.height == null ? app.screen.height : app.screen.height
            );

            // Set update parameters
            level.background.setUpdate(sprite.index, sprite.update.x, sprite.update.y);
        }

        // Initialize
        level.background.init();

        // Add to collection
        levels.data.push(level);
    }

    return levels;
}
