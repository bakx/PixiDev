import { Point } from "pixi.js";

export interface BackgroundsConfig {
    data: BackgroundConfig[];
}

export interface BackgroundConfig {
    name: string;
    sprites: BackgroundSpritesConfig[];
}

export interface BackgroundSpritesConfig {
    file: string;
    index: number;
    width: number;
    height: number;
    update: Point;
}