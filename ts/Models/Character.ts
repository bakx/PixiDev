import { AnimationSprite } from "./AnimatedSprite";

export class Characters {
    data: Character[] = [];
}

export class Character {
    id: string;
    name: string;
    private stage: PIXI.Container;
    private animationSource: AnimationSprite;
    private animationKey: string;
    private animation: PIXI.AnimatedSprite;

    constructor(stage: PIXI.Container, id: string, name: string) {
        this.stage = stage;
        this.id = id;
        this.name = name;
    }

    /** Get X position of character */
    get x() {
        return this.animation.x;
    }

    /** Set X position of character */
    set x(x: number) {
        this.animation.x = x;
    }

    /** Get Y position of character */
    get y() {
        return this.animation.y;
    }

    /** Set Y position of character */
    set y(y: number) {
        this.animation.y = y;
    }

    /** Get the animation speed of the character */
    get animationSpeed() {
        return this.animation.animationSpeed;
    }

    /** Set the animation speed of the character */
    set animationSpeed(speed: number) {
        console.debug(`Setting animation speed to ${speed} for character ${this.id}`);
        this.animation.animationSpeed = speed;
    }

    /** Add character to stage */
    addStage() {
        console.debug(`Adding character ${this.id} to the stage`);
        this.stage.addChild(this.animation);
    }

    /** Remove character to stage */
    removeStage() {
        console.debug(`Removing character ${this.id} to the stage`);
        this.stage.removeChild(this.animation);
    }

    /** Set the animation for the character */
    setAnimation(key: string, autoPlay: boolean = true, loop: boolean = true, interactive: boolean = true) {
        // Stop existing play
        if (this.animation) {
            if (this.animation.playing) {
                this.animation.stop();
            }
        }

        // Update animation key
        this.animationKey = key;

        // Assign new animation
        if (this.animation)
            this.animation.textures = this.animationSource.getAnimation(this.animationKey).textures;
        else
            this.animation = this.animationSource.getAnimation(this.animationKey);

        // Play?
        if (autoPlay) {
            this.animation.play();
        }

        // Loop?
        this.animation.loop = loop;

        // Interactive?
        this.animation.interactive = interactive;

        if (interactive) {
            let e = this;
            this.animation.removeAllListeners();

            this.animation.on("touchend", function () { e.playAnimation(e) });
            this.animation.on("click", function () { e.playAnimation(e) });
        }
    }

    playAnimation(char: Character) {        
        // Interactive?
        let key = char.animationSource.animationKeys[Math.floor(Math.random() * char.animationSource.animationKeys.length)];
        char.setAnimation(key, true, true);
    }

    /** Sets the source of the animation */
    setAnimationSource(source: AnimationSprite) {
        this.animationSource = source;
    }

    /** */
    update() {
    }
}

export enum CharacterPlayState {
    TO,
    DO
}