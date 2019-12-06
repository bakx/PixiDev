export class AnimationSprites {
    data: Map<string, AnimationSprite> = new Map<string, AnimationSprite>();
}

export class AnimationSprite {
    id: string;
    animationKeys: string[];
    animations: Map<string, PIXI.AnimatedSprite>;
    animationDetails: Map<string, AnimationDetails>;

    constructor(id: string) {
        this.id = id;
        this.animationKeys = [];
        this.animations = new Map<string, PIXI.AnimatedSprite>();
    }

    /** Add an animation key */
    addKey(key: string) {
        console.debug(`Adding animation key ${key} to ${this.id}`);
        this.animationKeys.push(key);
    }

    /** Add an animation */
    addAnimation(key: string, data: PIXI.AnimatedSprite) {
        console.debug(`Adding animation to key ${key} for ${this.id}`);
        this.animations.set(key, data);
    }

    /** Get all animation keys */
    getKeys() {
        return this.animationKeys;
    }

    /** Retrieve a specific animation */
    getAnimation(key: string) {
        if (this.animations.has(key)) {
            return this.animations.get(key);
        }

        throw new Error(`Unable to find animation ${key} for ${this.id}`);
    }
}

export class AnimationDetails {
    animationSpeed: number;
    loop: boolean;
}