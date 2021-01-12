import { Injectable } from '@angular/core';
import { Bucket } from '@app/classes/bucket/bucket';
import { Color } from '@app/classes/color/color';
import { Tool } from '@app/classes/tool/tool';
import { pickColorsFromCanvas } from '@app/classes/utils/canvas-helper';
import { FloodFillContinuousStrategy } from '@app/classes/utils/floodfill-strategy/floodfills/floodfill-continuous';
import { FloodFillNonContinuousStrategy } from '@app/classes/utils/floodfill-strategy/floodfills/floodfill-noncontinuous';
import { Point } from '@app/classes/utils/point';
import { MouseButton } from '@app/declarations/mouse.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { Size } from '@app/services/workspace/workspace.service';

export const DEFAULT_TOLERANCE = 10;

@Injectable({
    providedIn: 'root',
})
export class BucketService extends Tool {
    private currentBucket: Bucket;
    private canvasSize: Size;
    private oldColor: Color;
    private mouseDownPosition: Point;

    // Getting from bucket-attributes
    fillColor: Color;
    tolerance: number;

    readonly type: ToolType;

    constructor(protected drawingService: DrawingService, protected snapshotService: SnapshotFactoryService) {
        super(drawingService);
        this.type = ToolType.Bucket;
        this.tolerance = DEFAULT_TOLERANCE;
    }

    onMouseDown(event: PointerEvent): void {
        this.isProcessing = true;
        const mouseDown = this.getPositionFromMouse(event);
        this.drawFloodFill(mouseDown, event);
    }

    private drawFloodFill(mouseDown: Point, event: PointerEvent): void {
        this.mouseDownPosition = this.roundMousePosition(mouseDown);

        this.oldColor = this.getOldColor();

        this.canvasSize = {
            width: this.drawingService.canvasWidth,
            height: this.drawingService.canvasHeight,
        };

        if (this.failedInitialVerification()) {
            this.isProcessing = false;
            return;
        }

        // Left click: NonContinuous mode
        const indexOneDimensional = this.mouseDownPosition.y * this.canvasSize.width + this.mouseDownPosition.x;
        if (event.button === MouseButton.Left) {
            this.currentBucket = new Bucket(this.canvasSize, this.createfloodFillNonContinuous(indexOneDimensional));
        }

        // Right click: Continuous mode
        if (event.button === MouseButton.Right) {
            this.currentBucket = new Bucket(this.canvasSize, this.createfloodFillContinuous());
        }

        this.drawingService.drawBase(this.currentBucket);
        this.snapshotService.save(this.currentBucket);

        this.isProcessing = false;
    }

    private createfloodFillNonContinuous(indexOneDimensional: number): FloodFillNonContinuousStrategy {
        return new FloodFillNonContinuousStrategy(this.fillColor, this.oldColor, this.tolerance, indexOneDimensional);
    }

    private createfloodFillContinuous(): FloodFillContinuousStrategy {
        return new FloodFillContinuousStrategy(this.fillColor, this.oldColor, this.tolerance);
    }

    private failedInitialVerification(): boolean {
        return this.fillColor.uint32 === this.oldColor.uint32 || this.outsideCanvas(this.mouseDownPosition);
    }

    private outsideCanvas(position: Point): boolean {
        const oneDimensionalIndex = position.y * this.canvasSize.width + position.x;
        return oneDimensionalIndex < 0 || oneDimensionalIndex >= this.canvasSize.width * this.canvasSize.height;
    }

    private roundMousePosition(mousePosition: Point): Point {
        const x = Math.round(mousePosition.x);
        const y = Math.round(mousePosition.y);
        return new Point(x, y);
    }

    private getOldColor(): Color {
        return pickColorsFromCanvas(this.mouseDownPosition, 1, 1, this.drawingService.baseCtx)[0];
    }
}
