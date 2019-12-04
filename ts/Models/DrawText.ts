export class DrawText {
    private pixiText: PIXI.Text;

    constructor(stage: PIXI.Container, text: string, x: number, y: number, style?: PIXI.TextStyle) {
        let textStyle = (style) ? style : this.getDefaultStyle();
        this.pixiText = new PIXI.Text(text, textStyle);
        this.pixiText.x = x;
        this.pixiText.y = y;

        // Add to stage
        stage.addChild(this.pixiText);
    }

    set Text(text: string) {
        this.pixiText.text = text;
    }

    /** Set X location of text object */
    set x(x: number) {
        this.pixiText.x = x;
    }

    /** Set Y location of text object */
    set y(y: number) {
        this.pixiText.y = y;
    }

    getDefaultStyle(): PIXI.TextStyle {
        const style = new PIXI.TextStyle({
            fontFamily: "Tahoma",
            fontSize: 18,
            fontWeight: "bold",
            lineJoin: "round",
            stroke: "white",
            strokeThickness: 2
        });

        return style;
    };
}
