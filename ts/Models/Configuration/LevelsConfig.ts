import { Background } from "../Background";

export class LevelsConfig {
    "data": LevelConfig[];
}

export class LevelConfig {
    "name": string;
    "background": Background;
}