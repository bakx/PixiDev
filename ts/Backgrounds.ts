export class Background {
    private name: string;
    private backgroundArray: any[];
    private backgroundPositionOnUpdate: any[]

    constructor(name: string) {
        this.name = name;
        this.backgroundArray = [];
        this.backgroundPositionOnUpdate = [];
    }

    /** Get the name of the background */
    getName() {
        return this.name;
    }

    /** Add background to the stage */
    add(stage: any, image: string, width: number, height: number) {
        let texture = PIXI.Texture.from(image);
        let tileSprite = new PIXI.TilingSprite(texture, width, height);
        this.backgroundArray.push(tileSprite);
        stage.addChild(tileSprite);
    }

    /** Initialize  */
    init() {
        this.hide();
    }

    /** */
    setUpdate(index: number, x: number, y: number) {
        this.backgroundPositionOnUpdate.push({
            index: index,
            x: x,
            y: y
        });
    }

    /** */
    update() {
        for (let i = 0; i < this.backgroundPositionOnUpdate.length; i++) {
            let item = this.backgroundPositionOnUpdate[i];
            this.backgroundArray[item.index].tilePosition.x -= item.x;
            this.backgroundArray[item.index].tilePosition.y -= item.y;
        }
    }

    /** */
    hide() {
        for (let i = 0; i < this.backgroundArray.length; i++) {
            let item = this.backgroundArray[i];
            item.visible = false;
        }
    }

    /** */
    show() {
        for (let i = 0; i < this.backgroundArray.length; i++) {
            let item = this.backgroundArray[i];
            item.visible = true;
        }
    }
}