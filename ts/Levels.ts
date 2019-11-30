import { Background } from "./backgrounds"
import { loadJSON } from "./functions"
import { ILevel } from "./Interfaces/ILevel";

/** Load Levels */
export class Levels {

    static loadLevels(app: any) {

        let levels = [];
        let levelData: ILevel;
        loadJSON("config/levels.json", function (data: string) {
            levelData = JSON.parse(data);
        });

        if (levelData == null) {
            throw new Error("Unable to load levels.");
        }

        for (let i = 0; i < levelData.levels.length; i++) {
            let level = levelData.levels[i];

            // Set background for level
            let background = new Background(level.name);

            for (let j = 0; j < level.sprites.length; j++) {
                let sprite = level.sprites[j];

                // Add sprite
                background.add(
                    app.stage,
                    sprite.file,
                    sprite.width == null ? app.screen.width : app.screen.width,
                    sprite.height == null ? app.screen.height : app.screen.height
                );

                // Set update parameters
                background.setUpdate(sprite.index, sprite.update.x, sprite.update.y);
            }

            // Initialize
            background.init();

            // Add to collection
            levels.push(background);
        }

        return levels;
    }
}
