import { Point } from "pixi.js";
import { AnimationSprite } from "./AnimatedSprite";

export class Character {
    private id: string;
    private name: string;
    private stage: PIXI.Container;
    private animationSource: AnimationSprite;
    private animationKey: string;
    private animation: PIXI.AnimatedSprite;
    keys: string[]; // Delete?
    private position: Point;

    constructor(stage: PIXI.Container, id: string, name: string) {
        this.stage = stage;
        this.id = id;
        this.name = name;
    }

    /** Add animation key */
    //! Delete?
    addKey(key: string) {
        this.keys.push(key);
    }

    /** Get X position of character */
    get x() {
        return this.position.x;
    }

    /** Set X position of character */
    set x(x: number) {
        this.position.x = x;
    }

    /** Get Y position of character */
    get y() {
        return this.position.y;
    }

    /** Set Y position of character */
    set y(y: number) {
        this.position.y = y;
    }

    /** Set the animation for the character */
    setAnimation(key: string, autoPlay: boolean = true, loop: boolean = true) {
        // Stop existing play
        if (this.animation) {
            if (this.animation.playing) {
                this.animation.stop();
            }
        }

        // Assign new animation
        this.animation = this.animationSource.getAnimation(this.animationKey);

        // Play?
        if (autoPlay) {
            this.animation.play();
        }

        // Loop?
        this.animation.loop = loop;
    }

    update(stage: PIXI.Container) {
    }
}

export enum CharacterPlayState {
    IsON,
    OFF
}