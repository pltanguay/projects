import { Color, Index } from '@app/classes/color/color';
const BYTE_MAX_VALUE = 255;
const PERCENTAGE_MAX = 100;
const N_COLORS = 4;

/*
    This class holds the typed array buffer with pixel colors.
    It is used by the continuous and non-continuous algorithm in order to
    flood fill the array in exactly O(width*height) time complexity.
*/

export abstract class Floodfill {
    protected tolerance: number;
    protected fillColor: Color;
    protected oldColor: Color;

    protected imageData: ImageData;

    protected viewArrayUint32: Uint32Array;

    constructor(fillColor: Color, oldColor: Color, tolerance: number) {
        this.fillColor = fillColor;
        this.oldColor = oldColor;
        this.tolerance = (tolerance / PERCENTAGE_MAX) * BYTE_MAX_VALUE; // [0, 255]
    }

    /*
        Since we are adding a DataView of Uint32 to the same buffer, we acces the buffer from viewArrayUint32.
        the viewArrayUint32 is the sequence of RGBA of the canvas, but compacted!
        if I do this.viewArrayUint32[0] = 0x0000FFFF, this will do next to the point (0, 0) of the canvas:
        this.imageData.data[0] = 0xFF --red
        this.imageData.data[1] = 0xFF --green
        this.imageData.data[2] = 0x00 --blue
        this.imageData.data[0] = 0x00 --opacity
    */
    protected initTypedBuffer(imageData: ImageData): void {
        this.imageData = imageData;
        this.viewArrayUint32 = new Uint32Array(this.imageData.data.buffer);
    }

    protected fillPoint(indexPoint: number): void {
        this.viewArrayUint32[indexPoint] = this.fillColor.uint32;
    }

    protected hasPassedColorTest(indexNeighbour: number): boolean {
        const neighbourColor = this.viewArrayUint32[indexNeighbour]; // acces the color at the index specified (RGBA)
        if (neighbourColor === this.oldColor.uint32) return true;
        if (neighbourColor === this.fillColor.uint32) return false;
        return this.hasPassedToleranceTest(indexNeighbour);
    }

    protected isInsideCanvas(index: number): boolean {
        return index >= 0 && index < this.viewArrayUint32.length;
    }

    private hasPassedToleranceTest(indexNeighbour: number): boolean {
        // Get RGBa values of the color at the corresponding index in canvas (acces(O(1) complexity))
        const differenceRed = Math.abs(this.getRgbaByte(indexNeighbour, Index.red) - this.oldColor.redValueNumber);
        const differenceGreen = Math.abs(this.getRgbaByte(indexNeighbour, Index.green) - this.oldColor.greenValueNumber);
        const differenceBlue = Math.abs(this.getRgbaByte(indexNeighbour, Index.blue) - this.oldColor.blueValueNumber);

        const averageDifference = (differenceRed + differenceGreen + differenceBlue) / N_COLORS - 1;

        // Calculate average difference [0, 255] and compare with set tolerance
        return averageDifference < this.tolerance;
    }

    private getRgbaByte(index: number, offset: number): number {
        return this.imageData.data[N_COLORS * index + offset];
    }
}
