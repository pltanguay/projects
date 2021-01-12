import { Injectable } from '@angular/core';
import { Drawable } from '@app/classes/drawable/drawable';
import { CanvasService } from '@app/services/canvas/canvas.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    constructor(private canvasService: CanvasService) {}

    drawBase(drawable: Drawable): void {
        this.canvasService.isEmpty = false;
        drawable.draw(this.canvasService.context);
    }

    reDrawBase(drawable: Drawable): void {
        this.canvasService.isEmpty = false;
        drawable.redraw(this.canvasService.context);
    }

    drawPreview(drawable: Drawable): void {
        drawable.drawPreview(this.canvasService.previewCtx);
    }

    cleanGrid(): void {
        this.canvasService.cleanGrid();
    }

    cleanPreview(): void {
        this.canvasService.cleanPreview();
    }

    cleanBase(): void {
        this.canvasService.clean();
    }

    get baseCtx(): CanvasRenderingContext2D {
        return this.canvasService.context;
    }

    get previewCtx(): CanvasRenderingContext2D {
        return this.canvasService.previewCtx;
    }

    get gridCtx(): CanvasRenderingContext2D {
        return this.canvasService.gridCtx;
    }

    get canvasWidth(): number {
        return this.canvasService.width;
    }

    get canvasHeight(): number {
        return this.canvasService.height;
    }
}
