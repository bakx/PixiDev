export interface CharactersConfig {
    data: CharacterConfig[];
}

export interface CharacterConfig {
    name: string;
    sprite: string;
    defaultAnimationKey: string;
    defaultAnimationSpeed: number;
}