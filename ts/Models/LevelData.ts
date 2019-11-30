import { Background } from "./Background";
import { LevelSprites } from "./LevelSprites";
export class LevelData {
    name: string;
    background: Background;
    sprites: LevelSprites[] = [];
    entities: any[] = [];
}
