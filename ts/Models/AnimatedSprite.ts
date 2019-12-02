import { Dictionary } from 'typescript-collections';

export class AnimationSprites {
    sprites: AnimationSprite[] = [];
}

export class AnimationSprite {
    id: string;
    animationKeys: string[];
    animations: Dictionary<string, PIXI.AnimatedSprite>;

    constructor(id: string) {
        this.id = id;
        this.animationKeys = [];
        this.animations = new Dictionary<string, PIXI.AnimatedSprite>();
    }

    /** Add an animation key */
    addKey(key: string) {
        console.debug(`Adding animation key ${key} to ${this.id}`);
        this.animationKeys.push(key);
    }

    /** Add an animation */
    addAnimation(key: string, data: PIXI.AnimatedSprite) {
        console.debug(`Adding animation to key ${key} for ${this.id}`);
        this.animations.setValue(key, data);
    }

    /** Get all animation keys */
    getKeys() {
        return this.animationKeys;
    }

    /** Retrieve a specific animation */
    getAnimation(key: string) {
        if (this.animations.containsKey(key))
            return this.animations.getValue(key);

        throw new Error(`Unable to find animation ${key} for ${this.id}`);
    }
}