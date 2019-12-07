export class AnimationSprites {
    data: Map<string, AnimationSprite> = new Map<string, AnimationSprite>();
}

export class AnimationSprite {

    /** Constructor of the AnimationSprite class  
    * @param id the id of the animated sprite 
    * @param animations all animations of the sprite
    */
    constructor(id: string, animationKeys: string[], animations: Map<string, PIXI.AnimatedSprite>) {
        this._id = id;
        this._animationKeys = animationKeys;
        this._animations = animations;
    }

    /** ID of this collection of animated sprites */
    private _id: string;

    /** All animation keys of this collection */
    private _animationKeys: string[] = [];

    /** All animations of this collection */
    private _animations: Map<string, PIXI.AnimatedSprite> = new Map<string, PIXI.AnimatedSprite>();

    /** Get the id of this collection */
    id(): string { return this._id }

    /** Get all animation keys */
    animationKeys(): string[] { return this._animationKeys }

    /** Get animation for key */
    getAnimation(key: string) {
        if (!this._animations.has(key)) {
            throw new Error(`Animation id: ${this._id} does not contain an animation with key: ${key}`);
        }

        return this._animations.get(key);
    }
}

export class AnimationDetails {
    animationSpeed: number;
    loop: boolean;
}