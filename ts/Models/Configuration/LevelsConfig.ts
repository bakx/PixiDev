import { Point } from "pixi.js";

export interface LevelsConfig {
    data: LevelConfig[];
}

export interface LevelConfig {
    name: string;
    background: string;
    characters: LevelCharacterConfig[];
}

export interface LevelCharacterConfig {
    id: any;
    name: string;
    animationKey: string;
    animationSpeed: number;
    position: Point;
}