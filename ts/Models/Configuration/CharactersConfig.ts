export class CharactersConfig {
    "data": CharacterConfig[];
}

export class CharacterConfig {
    "name": string;
    "sprite": string;
    "defaultAnimationKey" : string;
    "position": PIXI.Point;
}
