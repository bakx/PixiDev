import { Point } from "pixi.js";
import { AnimationSprite } from "./AnimatedSprite";

export class Characters {
    data: Map<string, Character> = new Map<string, Character>();
}

export class Character {
    id: string;
    name: string;

    animationSource: AnimationSprite;
    animationKey: string;

    private stage: PIXI.Container;
    private animation: PIXI.AnimatedSprite;
    private _animationSpeed: number;
    private position: Point;

    autoPlay: boolean = true;
    loop: boolean = true;
    interactive: boolean = true;

    constructor(stage: PIXI.Container, id: string, name: string) {
        this.stage = stage;
        this.id = id;
        this.name = name;
        this.position = new Point();
    }

    /** Get X position of character */
    get x(): number {
        return this.position.x;
    }

    /** Set X position of character */
    set x(x: number) {
        //console.debug(`Setting x to ${x} for character ${this.id}`);
        this.position.x = x;
    }

    /** Get Y position of character */
    get y(): number {
        return this.position.y;
    }

    /** Set Y position of character */
    set y(y: number) {
        //console.debug(`Setting y to ${y} for character ${this.id}`);
        this.position.y = y;
    }

    /** Get the animation speed of the character */
    get animationSpeed(): number {
        return this._animationSpeed;
    }

    /** Set the animation speed of the character */
    set animationSpeed(speed: number) {
        console.debug(`Setting animation speed to ${speed} for character ${this.id}`);

        this._animationSpeed = speed;
    }

    /** Add character to stage */
    addStage() {
        console.debug(`Adding character ${this.id} to the stage at position ${this.position.x},${this.position.y}`);

        if (!this.animation) {
            throw new Error(`Animation object not set for ${this.id}`);
        }

        this.stage.addChild(this.animation);
    }

    /** Remove character to stage */
    removeStage() {
        console.debug(`Removing character ${this.id} to the stage`);
        this.stage.removeChild(this.animation);
    }

    /** Set the animation for the character */
    setAnimation(key: string, autoPlay: boolean = true, loop: boolean = true, interactive: boolean = true) {
        // Update local variables
        this.autoPlay = autoPlay;
        this.loop = loop;
        this.interactive = interactive;

        // Stop existing play
        if (this.animation) {
            if (this.animation.playing) {
                this.animation.stop();
            }
        }

        // Update animation key
        this.animationKey = key;

        // Assign new animation
        let isVisible: boolean = this.animation != null;
        if (isVisible) {
            this.stage.removeChild(this.animation);
        }

        let animationSource = this.animationSource.getAnimation(this.animationKey).textures;
        this.animation = new PIXI.AnimatedSprite(animationSource);
        this.animation.animationSpeed = this._animationSpeed;

        if (isVisible) {
            this.stage.addChild(this.animation);
        }

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
        this.animation.x = this.x++;
        this.animation.y = this.y;
    }
}

export enum CharacterPlayState {
    TO,
    DO
}