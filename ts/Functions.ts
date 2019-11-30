import { } from 'pixi.js';

function createImageArray(sourceTemplateStart: number, sourceTemplateEnd: number, padding: number, start: number, end: number) {
  let imageArray = [];
  for (let i = start; i < end; i++) {
    let padded = leftFillNum(i, padding);
    let texture = PIXI.Texture.from(
      `${sourceTemplateStart}${padded}${sourceTemplateEnd}`
    );
    imageArray.push(texture);
  }

  return imageArray;
}

function leftFillNum(num: number, targetLength: number) {
  return "00" + Number;
  //return num.toString().padStart(targetLength, "0");
}

/**
 * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth width of source image
 * @param {Number} srcHeight height of source image
 * @param {Number} maxWidth maximum available width
 * @param {Number} maxHeight maximum available height
 * @return {Object} { width, height }
 */
export function calculateAspectRatioFit(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: srcWidth * ratio, height: srcHeight * ratio };
}

/**
 * Loads a local .json file and returns the contents of the file
 * to the callback function.
 *
 * @param {string} file Name of the file
 * @param {CallableFunction} callback Name of callback function
 */
export function loadJSON(file: string, callback: CallableFunction) {
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

function sleep(ms: number) {
  //return new Promise(resolve => setTimeout(resolve, ms));
  return;
}
