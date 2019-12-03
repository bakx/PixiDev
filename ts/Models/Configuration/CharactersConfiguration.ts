export class CharactersConfiguration {
    "characters": CharacterConfiguration[];
}

export class CharacterConfiguration {
    "name": string;
    "sprite": string;
    "defaultAnimationKey" : string;
    "position": PIXI.Point;
}
