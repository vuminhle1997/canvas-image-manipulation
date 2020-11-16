export enum FilterEnum  {
    ORIGINAL = 'ORIGINAL'
}

const clamp = (num: number) => {
    if (num < 0) return 0;
    if (num > 255) return 255;
    return num;
}

/**
 * Taken from here
 * https://gist.github.com/mjackson/5311256
 * @param r
 * @param g
 * @param b
 */

export const rgbToHsv = (r: number, g:number, b: number): [number, number, number] => {
    r /= 255; g /= 255; b /= 255;

    const max: number = Math.max(r, g, b);
    const min: number = Math.min(r, g, b);
    let h: number = 0;
    let s: number;
    let v: number = max;

    let d = max - min;
    s = max === 0 ? 0 : (d/max);

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r:
                h = (g-b) /d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b-r) / d + 2;
                break;
            case b:
                h = (r-g) / d + 4;
                break;
            default:
                break;
        }
        h /= 6;
    }
    return [h, s, v];
}

/**
 * Taken from here
 * https://gist.github.com/mjackson/5311256
 * @param h
 * @param s
 * @param v
 */

export const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
    let r;
    let g;
    let b;

    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }
    if (r && g && b)
        return [ r * 255, g * 255, b * 255 ];
    else
        return [0, 0, 0];
}

export const originalFilter = (img: HTMLImageElement, imgData: ImageData, ctx: CanvasRenderingContext2D,
                               width: number, height: number) => {
    ctx.drawImage(img, 0, 0, img.width, img.height);
}

export const grayscaleFilter = (img: HTMLImageElement, imgData: ImageData, ctx: CanvasRenderingContext2D,
                                width: number, height: number) => {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const pos = (y * width + x) * 4;

            const r = imgData.data[pos];
            const g = imgData.data[pos + 1];
            const b = imgData.data[pos + 2];
            const diff = (r + g + b) / 3;

            imgData.data[pos] = diff;
            imgData.data[pos + 1] = diff;
            imgData.data[pos + 2] = diff;
        }
    }

    ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
}

export const vividFilter = (img: HTMLImageElement, imgData: ImageData, ctx: CanvasRenderingContext2D,
                            width: number, height: number) => {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const pos = (y * width + x) * 4;

            const r = imgData.data[pos];
            const g = imgData.data[pos + 1];
            const b = imgData.data[pos + 2];

            let hsv = rgbToHsv(r,g,b);
            hsv[1] = hsv[1] * 1.45;

            const newRGB = hsvToRgb(hsv[0], hsv[1], hsv[2]);
            imgData.data[pos] = newRGB[0];
            imgData.data[pos + 1] = newRGB[1];
            imgData.data[pos + 2] = newRGB[2];
        }
    }

    ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
}

export const lowerSaturation = (img: HTMLImageElement, imgData: ImageData, ctx: CanvasRenderingContext2D,
                                width: number, height: number) => {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const pos = (y * width + x) * 4;

            const r = imgData.data[pos];
            const g = imgData.data[pos + 1];
            const b = imgData.data[pos + 2];

            let hsv = rgbToHsv(r,g,b);
            hsv[1] = hsv[1] * .55;

            const newRGB = hsvToRgb(hsv[0], hsv[1], hsv[2]);
            imgData.data[pos] = newRGB[0];
            imgData.data[pos + 1] = newRGB[1];
            imgData.data[pos + 2] = newRGB[2];
        }
    }

    ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
}

export const sepia = (img: HTMLImageElement, imgData: ImageData, ctx: CanvasRenderingContext2D,
                      width: number, height: number) => {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const pos = (y * width + x) * 4;

            const r: number = imgData.data[pos];
            const g: number = imgData.data[pos + 1];
            const b: number = imgData.data[pos + 2];

            const newR = clamp((r * 0.393) + (g * 0.769) + (b * 0.189));
            const newG = clamp((r * 0.349) + (g * 0.686) + (b * 0.168));
            const newB = clamp((r * 0.272) + (g * 0.534) + (b * 0.131));

            imgData.data[pos] = newR;
            imgData.data[pos + 1] = newG;
            imgData.data[pos + 2] = newB;
        }
    }
    ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
}

export const applyHSVChanges = (img: HTMLImageElement, imgData: ImageData, ctx: CanvasRenderingContext2D, width: number,
                                height: number, hue: number, saturation: number, brightness: number) => {
    let s = 1 + (saturation/100);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const pos = (y * width + x) * 4;
            let hsv = rgbToHsv(imgData.data[pos], imgData.data[pos + 1], imgData.data[pos + 2]);
            hsv[1] = hsv[1] * s;

            const newRGB = hsvToRgb(hsv[0], hsv[1], hsv[2]);
            imgData.data[pos] = clamp(newRGB[0]+brightness);
            imgData.data[pos + 1] = clamp(newRGB[1]+brightness);
            imgData.data[pos + 2] = clamp(newRGB[2]+brightness);
        }
    }

    ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
}