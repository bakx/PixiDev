export class CharactersConfiguration {
    "characters": CharacterConfiguration[];
}

export class CharacterConfiguration {
    "name": string;
    "sprite": string;
    "position": PIXI.Point;
}
