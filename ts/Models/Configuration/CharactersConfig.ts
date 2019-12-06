export interface CharactersConfig {
    data: CharacterConfig[];
}

export interface CharacterConfig {
    id: string;
    defaultAnimationKey: string;
    defaultAnimationSpeed: number;
    animationDetails: CharacterAnimationDetailsConfig[];
}

export interface CharacterAnimationDetailsConfig {
    key: string;
    overrides: CharacterAnimationDetailsDataConfig;
}

export interface CharacterAnimationDetailsDataConfig {
    animationSpeed: number;
    loop: boolean;
}