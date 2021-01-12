import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { FloodFillNonContinuousStrategy } from '@app/classes/utils/floodfill-strategy/floodfills/floodfill-noncontinuous';

export interface Pixel {
    x: number;
    y: number;
    isActive: boolean;
}

export interface BoxBorders {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export interface MagicSelectionResult {
    borderPoints: Set<Vec2>;
    selectionCanvasArray: Uint32Array;
    clippedSelectionArray: Uint32Array;
    boxBorders: BoxBorders;
    borderPath: Path2D;
}

@Injectable({
    providedIn: 'root',
})
export class MagicWandAlgorithmService {
    private left: number;
    private right: number;
    private top: number;
    private bottom: number;
    private borderPoints: Set<Vec2>;
    private viewArrayUint32Selected: Uint32Array;
    private viewArrayUint32White: Uint32Array;
    private path: Path2D;
    private floodFillStrategy: FloodFillNonContinuousStrategy;

    constructor() {
        this.floodFillStrategy = new FloodFillNonContinuousStrategy({} as Color, {} as Color, 0, 0);
    }

    onMouseLeft(imageData: ImageData, oldColor: Color, index: number): MagicSelectionResult {
        const fillColor = 0xffffff;
        this.floodFillStrategy.fillColor = { uint32: fillColor } as Color;
        this.floodFillStrategy.oldColor = oldColor;
        this.floodFillStrategy.mouseDownIndex = index;
        imageData = this.floodFillStrategy.do(imageData);

        this.marchingSquaresAlgorithm(imageData, fillColor);

        this.refillArray(fillColor, oldColor.uint32);

        return this.getMagicSelectionResult();
    }

    onMouseRight(imageData: ImageData, oldColor: Color): MagicSelectionResult {
        return this.marchingSquaresAlgorithm(imageData, oldColor.uint32);
    }

    private marchingSquaresAlgorithm(imageData: ImageData, oldColor: number): MagicSelectionResult {
        this.initializeState(imageData);
        for (let i = 0; i < imageData.width * (imageData.height + 1); i++) {
            const x = i % imageData.width;
            const y = Math.ceil(i / imageData.width);

            if (x <= 0 || y <= 0) continue;

            const currentSquare: Pixel[] = this.createSquare(i, x, y, imageData.width, oldColor);
            const currentPixel: Pixel = currentSquare[0];

            this.updatePixelArrays(i, currentPixel);

            this.updateBoxDimension(currentPixel);

            this.computeSquare(x, y, currentSquare);
        }

        return this.getMagicSelectionResult();
    }

    private initializeState(imageData: ImageData): void {
        this.viewArrayUint32Selected = new Uint32Array(imageData.data.buffer);
        this.viewArrayUint32White = new Uint32Array(this.viewArrayUint32Selected.length);
        this.borderPoints = new Set();
        this.left = imageData.width;
        this.right = 0;
        this.top = imageData.height;
        this.bottom = 0;
        this.path = new Path2D();
    }

    private createSquare(i: number, x: number, y: number, width: number, color: number): Pixel[] {
        const currentPixel = { x, y, isActive: this.isPixelActive(i, color) };
        const leftPixel = { x: x - 1, y, isActive: this.isPixelActive(i - 1, color) };
        const upPixel = { x, y: y - 1, isActive: this.isPixelActive(i - width, color) };
        const upperLeftPixel = { x: x - 1, y: y - 1, isActive: this.isPixelActive(i - width - 1, color) };
        return [currentPixel, leftPixel, upPixel, upperLeftPixel];
    }

    private isPixelActive(index: number, color: number): boolean {
        return this.viewArrayUint32Selected[index] <= color + 1 && this.viewArrayUint32Selected[index] >= color - 1;
    }

    private updatePixelArrays(index: number, pixel: Pixel): void {
        if (pixel.isActive) {
            const whiteColor = 0xffffffff;
            this.viewArrayUint32White[index] = whiteColor;
            return;
        }

        this.viewArrayUint32White[index] = this.viewArrayUint32Selected[index];
        this.viewArrayUint32Selected[index] = 0;
    }

    private updateBoxDimension(pixel: Pixel): void {
        if (!pixel.isActive) return;

        if (pixel.x < this.left) {
            this.left = pixel.x;
        }

        if (pixel.x > this.right) {
            this.right = pixel.x;
        }

        if (pixel.y < this.top) {
            this.top = pixel.y;
        }

        if (pixel.y > this.bottom) {
            this.bottom = pixel.y;
        }
    }

    private computeSquare(x: number, y: number, square: Pixel[]): void {
        const activeCorners = square.filter((pixel) => pixel.isActive);
        switch (activeCorners.length) {
            case 1:
                this.onePointActive(activeCorners[0], x, y);
                break;
            case 2:
                this.twoPointsActive(activeCorners, x, y);
                break;
            case 2 + 1:
                const inactiveCorners = square.filter((pixel) => !pixel.isActive);
                this.onePointActive(inactiveCorners[0], x, y);
                break;

            default:
                break;
        }
    }

    private onePointActive(point: Pixel, x: number, y: number): void {
        // Ref: https://en.wikipedia.org/wiki/Marching_squares
        // cases 1000 0100 0010 0001 and one complement too
        let v1: Vec2 = { x: x - 1, y };
        let v2: Vec2 = { x, y: y - 1 };
        const xval = point.x - x;
        const yval = point.y - y;

        if (xval * yval < 0) {
            v1 = { x, y: y - 1 };
            v2 = { x: x - 1, y };
        }
        this.addPointsToPath(v1, v2);
    }

    private twoPointsActive(activeCorners: Pixel[], x: number, y: number): void {
        // Ref: https://en.wikipedia.org/wiki/Marching_squares
        // cases 0101 1010
        let v1: Vec2;
        let v2: Vec2;
        if (activeCorners[0].x === activeCorners[1].x) {
            const xval = x - 1 / 2;
            v1 = { x: xval, y };
            v2 = { x: xval, y: y - 1 };
            this.addPointsToPath(v1, v2);
            return;
        }

        // cases 0011 1100
        if (activeCorners[0].y === activeCorners[1].y) {
            const yval = y - 1 / 2;
            v1 = { x, y: yval };
            v2 = { x: x - 1, y: yval };
            this.addPointsToPath(v1, v2);
            return;
        }

        // cases 0110 1001
        this.onePointActive(activeCorners[0], x, y);
        this.onePointActive(activeCorners[1], x, y);
    }

    private getMagicSelectionResult(): MagicSelectionResult {
        return {
            borderPoints: this.borderPoints,
            selectionCanvasArray: this.viewArrayUint32Selected,
            clippedSelectionArray: this.viewArrayUint32White,
            boxBorders: { left: this.left, top: this.top, right: this.right, bottom: this.bottom },
            borderPath: this.path,
        };
    }

    private addPointsToPath(v1: Vec2, v2: Vec2): void {
        this.borderPoints.add(v1);
        this.borderPoints.add(v2);
        this.path.moveTo(v1.x, v1.y);
        this.path.lineTo(v2.x, v2.y);
    }

    private refillArray(color: number, fillColor: number): void {
        for (let i = 0; i < this.viewArrayUint32White.length; i++) {
            if (this.viewArrayUint32Selected[i] === color) {
                this.viewArrayUint32Selected[i] = fillColor;
            }
        }
    }
}
