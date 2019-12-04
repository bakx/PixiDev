import { Background } from "./Background";
import { Character } from "./Character";


export class Levels {
    data: LevelData[] = [];
}

export class LevelData {
    name: string;
    background: Background;
    characters: Character[];
    entities: any[] = [];
}