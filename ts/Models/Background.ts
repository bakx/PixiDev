import { Point } from "pixi.js";
import { Dictionary } from 'typescript-collections';

export class Backgrounds {
    data: Dictionary<string, Background> = new Dictionary<string, Background>();
}

export class Background {
    name: string;
    private backgroundArray: PIXI.TilingSprite[];
    private backgroundUpdates: BackgroundUpdate[];

    constructor(name: string) {
        this.name = name;
        this.backgroundArray = [];
        this.backgroundUpdates = [];
    }

    /** Add background to the stage */
    add(stage: PIXI.Container, image: string, width: number, height: number) {
        let texture = PIXI.Texture.from(image);
        let tileSprite = new PIXI.TilingSprite(texture, width, height);
        this.backgroundArray.push(tileSprite);

        stage.addChild(tileSprite);
    }

    /** Initialize  */
    init() {
        this.hide();
    }

    /** Add position update for individual layers */
    addUpdate(index: number, x: number, y: number) {
        let backgroundUpdate = new BackgroundUpdate();
        backgroundUpdate.index = index;
        backgroundUpdate.point = new Point(x, y);

        this.backgroundUpdates.push(backgroundUpdate);
    }

    /** Update the position of all layers */
    update() {
        for (let i = 0; i < this.backgroundUpdates.length; i++) {
            let item = this.backgroundUpdates[i];
            this.backgroundArray[item.index].tilePosition.x -= item.point.x;
            this.backgroundArray[item.index].tilePosition.y -= item.point.y;
        }
    }

    /** Hides all layers */
    hide() {
        for (let i = 0; i < this.backgroundArray.length; i++) {
            let item = this.backgroundArray[i];
            item.visible = false;
        }
    }

    /** Shows all layers */
    show() {
        for (let i = 0; i < this.backgroundArray.length; i++) {
            let item = this.backgroundArray[i];
            item.visible = true;
        }
    }
}

export class BackgroundUpdate {
    index: number;
    point: PIXI.Point;
}