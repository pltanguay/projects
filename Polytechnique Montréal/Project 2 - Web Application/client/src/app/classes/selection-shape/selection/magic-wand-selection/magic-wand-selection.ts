import { Matrix } from '@app/classes/matrix/matrix';
import { Selection } from '@app/classes/selection-shape/selection/selection';

export class MagicWandSelection extends Selection {
    imageData: ImageData;
    previewSelectionCanvas: HTMLCanvasElement;
    private strokeDrawed: boolean;

    path: Path2D;

    constructor(selectionCanvas: HTMLCanvasElement, previewSelectionCanvas: HTMLCanvasElement, imageData: ImageData, matrix?: Matrix) {
        super(selectionCanvas, { x: 0, y: 0 }, matrix);
        this.previewSelectionCanvas = previewSelectionCanvas;
        this.imageData = imageData;
        this.strokeDrawed = false;
    }

    protected processDrawing(ctx: CanvasRenderingContext2D): void {
        this.basicDrawing(ctx, this.selectionCanvas);
    }

    protected processPreviewDrawing(ctx: CanvasRenderingContext2D): void {
        if (this.strokeDrawed) {
            this.previewSelectionCanvas = this.selectionCanvas;
        }
        this.strokeDrawed = true;

        this.basicDrawing(ctx, this.previewSelectionCanvas);
    }

    protected basicDrawing(ctx: CanvasRenderingContext2D, selectionCanvas: HTMLCanvasElement): void {
        if (!this.pasted) this.drawVoid(ctx);
        if (this.deleted) return;

        ctx.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e, this.matrix.f);

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(selectionCanvas, -selectionCanvas.width / 2, -selectionCanvas.height / 2);
    }

    drawVoid(ctx: CanvasRenderingContext2D): void {
        ctx.putImageData(this.imageData, 0, 0);
    }
}
