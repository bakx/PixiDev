import { Point } from "pixi.js";

export class BackgroundsConfig {
    "data": BackgroundConfig[];
}

export class BackgroundConfig {
    "name": string;
    "sprites": BackgroundSpritesConfig[];
}

export class BackgroundSpritesConfig {
    "file": string;
    "index": number;
    "width": number;
    "height": number;
    "update": Point;
}

