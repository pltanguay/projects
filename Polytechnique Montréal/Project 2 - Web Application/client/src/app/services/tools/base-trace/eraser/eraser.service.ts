import { Injectable } from '@angular/core';
import { Eraser } from '@app/classes/base-trace/eraser/eraser';
import { Rectangle } from '@app/classes/contour-shape/rectangle/rectangle';
import { DEFAULT_TOOL_WIDTH } from '@app/classes/tool/tool';
import { Point } from '@app/classes/utils/point';
import { MouseButton } from '@app/declarations/mouse.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BaseTraceService } from '@app/services/tools/base-trace/base-trace.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

export const ERASER_DEFAULT_WIDTH = 5;

@Injectable({
    providedIn: 'root',
})
export class EraserService extends BaseTraceService {
    private rectangle: Rectangle;

    readonly type: ToolType;

    constructor(drawingService: DrawingService, snapShotService: SnapshotFactoryService) {
        super(drawingService, snapShotService);
        this.type = ToolType.Eraser;
        this.width = ERASER_DEFAULT_WIDTH;
        this.rectangle = new Rectangle(DEFAULT_TOOL_WIDTH, 'black', 'white', true, true);
        this.newTrace();
    }

    onMouseDown(event: PointerEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.newTrace();
            this.isProcessing = true;
            this.mousePosition = this.getPositionFromMouse(event);
            this.currentTrace.addPoint(this.mousePosition);
            this.drawingService.drawBase(this.currentTrace);
        }
    }

    onMouseUp(event: PointerEvent): void {
        if (this.mouseDown) {
            this.isProcessing = false;
            this.snapShotService.save(this.currentTrace);
        }
        this.mouseDown = false;
    }

    stopDrawing(): void {
        this.drawingService.cleanPreview();
        if (!this.mouseDown) return;

        this.snapShotService.save(this.currentTrace);
        this.mouseDown = false;
        this.isProcessing = false;
    }

    onMouseMove(event: PointerEvent): void {
        this.mousePosition = this.getPositionFromMouse(event);

        if (this.mouseDown) {
            this.currentTrace.addPoint(this.mousePosition);
            this.drawingService.drawBase(this.currentTrace);
        }

        this.drawEraser();
    }

    onMouseOut(event: PointerEvent): void {
        if (this.isReallyOut(event)) this.drawingService.cleanPreview();
    }

    newTrace(): void {
        this.currentTrace = new Eraser(this.width);
    }

    private drawEraser(): void {
        this.drawingService.cleanPreview();
        this.rectangle.upperLeft = new Point(this.mousePosition.x - this.width / 2, this.mousePosition.y - this.width / 2);
        this.rectangle.dimension = { width: this.width, height: this.width, canContourFit: true };
        this.drawingService.drawPreview(this.rectangle);
    }
}
