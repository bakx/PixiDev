import { Background } from "./Background";


export class Levels {
    "data": LevelData[] = [];
}

export class LevelData {
    "name": string;
    "background": Background;
    "entities": any[] = [];
}