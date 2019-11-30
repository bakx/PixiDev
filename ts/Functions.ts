import { Point } from "pixi.js";

export class Functions {
  static createImageArray(sourceTemplateStart: number, sourceTemplateEnd: number, padding: number, start: number, end: number) {
    let imageArray = [];
    for (let i = start; i < end; i++) {
      let padded = this.leftFillNum(i, padding);
      let texture = PIXI.Texture.from(
        `${sourceTemplateStart}${padded}${sourceTemplateEnd}`
      );
      imageArray.push(texture);
    }

    return imageArray;
  }

  static leftFillNum(num: number, targetLength: number) {
    return num.toString().padStart(targetLength, "0");
  }

  /**
   * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
   * images to fit into a certain area.
   *
   * @param {Number} srcWidth width of source image
   * @param {Number} srcHeight height of source image
   * @param {Number} maxWidth maximum available width
   * @param {Number} maxHeight maximum available height
   * @return {Point} { width, height }
   */
  static calculateAspectRatioFit(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number): Point {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return new Point(srcWidth * ratio, srcHeight * ratio);
  }

  /**
   * Loads a local .json file and returns the contents of the file
   * to the callback function.
   *
   * @param {string} file Name of the file
   * @param {CallableFunction} callback Name of callback function
   */
  static async loadJSON(file: string, callback: CallableFunction) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", file, false);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == 200) {
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
