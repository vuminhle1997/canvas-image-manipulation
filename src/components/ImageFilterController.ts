export module ImageFilterController {
    const clamp = (num: number) => {
        if (num < 0) return 0;
        if (num > 255) return 255;
        return num;
    }

    export const originalFilter = (img: HTMLImageElement, imgData: ImageData, ctx: CanvasRenderingContext2D,
                            width: number, height: number) => {
        ctx.drawImage(img, 0, 0, img.width, img.height);
    }

    export const blackNWhiteFilter = (img: HTMLImageElement, imgData: ImageData, ctx: CanvasRenderingContext2D, width: number, height: number) => {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const pos = (y * width + x) * 4;

                const r = imgData.data[pos];
                const g = imgData.data[pos + 1];
                const b = imgData.data[pos + 2];
                const diff = (r + g + b) /3;

                imgData.data[pos] = diff;
                imgData.data[pos + 1] = diff;
                imgData.data[pos + 2] = diff;
            }
        }

        ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
    }

    export const sepia = (img: HTMLImageElement, imgData: ImageData, ctx: CanvasRenderingContext2D, width: number, height: number) => {
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

    export const applyBrightness = (img: HTMLImageElement, imgData: ImageData, ctx: CanvasRenderingContext2D, width: number, height: number, brightness: number) => {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const pos = (y * width + x) * 4;

                const r: number = imgData.data[pos];
                const g: number = imgData.data[pos + 1];
                const b: number = imgData.data[pos + 2];

                const newR = clamp(r + brightness);
                const newG = clamp(g + brightness);
                const newB = clamp(b + brightness);

                imgData.data[pos] = newR;
                imgData.data[pos + 1] = newG;
                imgData.data[pos + 2] = newB;
            }
        }
        ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
    }
}
