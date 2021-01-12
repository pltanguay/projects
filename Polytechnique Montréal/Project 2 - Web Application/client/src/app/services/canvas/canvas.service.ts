import { ElementRef, Injectable } from '@angular/core';

export const MIN_CANVAS_SIZE = 250;
export type callback = () => void;

@Injectable({
    providedIn: 'root',
})
export class CanvasService {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    gridCtx: CanvasRenderingContext2D;
    isEmpty: boolean;

    private imageData: ImageData;

    constructor() {
        this.isEmpty = true;
    }

    setCanvas(canvas: ElementRef<HTMLCanvasElement>): void {
        this.canvas = canvas.nativeElement;
        this.context = canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    setSize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.setBackgroundColorWhite();

        if (this.gridCtx === undefined) return;
        this.gridCtx.canvas.width = width;
        this.gridCtx.canvas.height = height;
    }

    setBackgroundColorWhite(): void {
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clean(): void {
        this.isEmpty = true;
        this.clearCanvas(this.context);
    }

    cleanPreview(): void {
        this.clearCanvas(this.previewCtx);
    }

    cleanGrid(): void {
        this.clearCanvas(this.gridCtx);
    }

    getOffsetLeft(): number {
        const rectBounds = this.canvas.getBoundingClientRect();
        return rectBounds.x;
    }

    getOffsetTop(): number {
        const rectBounds = this.canvas.getBoundingClientRect();
        return rectBounds.top;
    }

    drawImage(image: HTMLImageElement): void {
        this.isEmpty = false;
        this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }

    getImageData(): ImageData {
        return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    putImageData(image: ImageData): void {
        this.context.putImageData(image, 0, 0, 0, 0, this.canvas.width, this.canvas.height);
    }

    storeImageData(): void {
        this.imageData = this.getImageData();
    }

    restoreImageData(): void {
        if (!this.imageData) return;
        this.context.putImageData(this.imageData, 0, 0, 0, 0, this.canvas.width, this.canvas.height);
    }

    createGrid(canvas: ElementRef<HTMLCanvasElement>): void {
        this.gridCtx = canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx.canvas.width = this.width;
        this.gridCtx.canvas.height = this.height;
    }

    get width(): number {
        return this.canvas.width;
    }

    get height(): number {
        return this.canvas.height;
    }

    private clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
}
