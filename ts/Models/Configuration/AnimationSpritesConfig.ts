export interface AnimationSpritesConfig {
    data: AnimationSpriteConfig[];
}

export interface AnimationSpriteConfig {
    id: string;
    filename: string;
    startAt: number;
    endAt: number;
    animationSpeed: number;
}