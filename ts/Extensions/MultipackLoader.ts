import { AnimationSprite } from "../Models/AnimatedSprite";

/**
 * Notes:
 * This loader expects that sprite names are in format ending with _NNN (e.g., sprite_name_015). 
 * It will consider sprite_name the animation key and 015 the index of the animation.
 */

export class MultipackLoader {

    /** Constructor of the MultipackLoader class  
    * @param id the id of the animated sprite
    */
    constructor(id: string) {
        this._id = id;
    }

    /** ID of this collection of animated sprites */
    private _id: string;

    /** All animation keys of this collection */
    private _animationKeys: string[] = [];

    /** All animation of this collection */
    private _animations: Map<string, PIXI.AnimatedSprite> = new Map<string, PIXI.AnimatedSprite>();

    /** Get all animation keys */
    animationKeys(): string[] { return this._animationKeys }

    /** Constructor of the MultipackLoader class  
    * @param file filename pattern of the animated sprite (e.g., /gfx/character/anubis/anubis-)
    * @param startAt start position of the file (e.g., 0 to start with /gfx/character/anubis/anubis-0)
    * @param endAt end position of the file (e.g., 1 to end with /gfx/character/anubis/anubis-1)
    * @param callback function to call when loading completes. It can call any function that includes a (id : string, message : string, sprites : AnimationSprite)
    */
    loadFile(file: string, startAt: number, endAt: number, callback: CallableFunction) {
        // Initialize the loader
        const loader = new PIXI.Loader();
        // Keep track of all files passed to the loader
        let files: string[] = [];

        // Holds all animation frames
        let animationFrames: Map<string, Map<number, object>> = new Map<string, Map<number, object>>();

        // Add all files to the loader
        for (let i = startAt; i <= endAt; i++) {
            // Generate filename
            let filename = `${file}${i}.json`;

            // Add to collection to keep track
            files.push(filename);

            // Diagnostics
            console.debug(`Adding animation file: ${filename} for id: ${this._id}`);

            // Add to the loader
            loader.add(filename, filename);
        }

        /** Callback that processes the loaded resources and adds them to the animatedSprites object */
        loader.load((loader: any, resources: any) => {
            // Loop through all resource files
            for (let i = 0; i < files.length; i++) {
                let resourceFile: PIXI.LoaderResource = resources[files[i]];

                // Loop through the frames
                for (let key in resourceFile.data.frames) {
                    // Convert key to animation key
                    let animationKey = key.slice(0, key.length - 4);

                    // Get index of animation
                    let animationIndex = parseInt(key.slice(key.length - 3, key.length));

                    // Does the key exist?
                    if (animationFrames.has(animationKey)) {
                        // Retrieve existing frames for this animation
                        let frames = animationFrames.get(animationKey);
                        frames.set(animationIndex, PIXI.Sprite.from(key));
                    }
                    else {
                        // Create new placeholder for the frame animations
                        let frame: Map<number, object> = new Map<number, object>();
                        frame.set(animationIndex, PIXI.Sprite.from(key));

                        // Add the frame
                        animationFrames.set(animationKey, frame);

                        // Add the animation key
                        this._animationKeys.push(animationKey);
                    }
                }
            }

            // Prepare the animations
            for (let i = 0; i < this._animationKeys.length; i++) {
                // Prepare the key
                let key = this._animationKeys[i];

                // Get the animation frames                
                let frames = animationFrames.get(key);
                let indexedFrames: any = [];

                // Loop through all animations
                for (let j = 0; j < frames.size; j++) {
                    // Get the animation at a specific index
                    let frame: any = frames.get(j);
                    indexedFrames.push(frame);
                }

                // Set the animation frames
                this._animations.set(key, new PIXI.AnimatedSprite(indexedFrames));
            }
        });

        /** Fatal error while loading resources */
        loader.onError.add((err: string) => {
            throw new Error(err);
        });

        /** When loading is complete, perform callback to inform dependent parts */
        loader.onComplete.add(() => {
            let animationSprite: AnimationSprite = new AnimationSprite(this._id, this._animationKeys, this._animations);

            // Diagnostics
            this._animationKeys.forEach(key => {
                console.debug(`Animation key: ${key} for id: ${this._id}`);
            });

            callback(this._id, `${this._id} was loaded succesfully`, animationSprite);
        });
    }

    /** Get animation for key */
    getAnimation(key: string) {
        if (!this._animations.has(key)) {
            throw new Error(`Animation id: ${this._id} does not contain an animation with key: ${key}`);
        }

        return this._animations.get(key);
    }
}