import { DrawableObject } from '@app/classes/drawable/drawable';
import { FloodfillStrategy } from '@app/classes/utils/floodfill-strategy/floodfill';
import { Size } from '@app/services/workspace/workspace.service';

export class Bucket extends DrawableObject {
    private floodfillStrategy: FloodfillStrategy;
    private canvasSize: Size;

    constructor(canvasSize: Size, floodfillStrategy: FloodfillStrategy) {
        super();
        this.canvasSize = canvasSize;
        this.floodfillStrategy = floodfillStrategy;
    }

    processDrawing(ctx: CanvasRenderingContext2D): void {
        const imageData = this.floodfillStrategy.do(ctx.getImageData(0, 0, this.canvasSize.width, this.canvasSize.height));
        ctx.putImageData(imageData, 0, 0);
    }
}
