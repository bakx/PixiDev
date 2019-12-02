import { Background } from "./Background";

import { Point } from "pixi.js";

export class Levels {
    levels: LevelData[] = [];
}

export class LevelData {
    name: string;
    background: Background;
    sprites: LevelSprites[] = [];
    entities: any[] = [];
}

export class LevelSprites {
    file: string;
    index: number;
    width: number;
    height: number;
    update: Point;
}