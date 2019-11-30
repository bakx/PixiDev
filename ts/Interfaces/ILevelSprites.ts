import { Point } from "pixi.js";
export interface ILevelSprites {
    file: string;
    index: number;
    width: number;
    height: number;
    update: Point;
}
