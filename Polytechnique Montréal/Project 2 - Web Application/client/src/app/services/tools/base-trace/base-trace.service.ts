import { Injectable } from '@angular/core';
import { BaseTrace } from '@app/classes/base-trace/base-trace';
import { DEFAULT_TOOL_WIDTH, Tool } from '@app/classes/tool/tool';
import { MouseButton } from '@app/declarations/mouse.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

@Injectable({
    providedIn: 'root',
})
export abstract class BaseTraceService extends Tool {
    currentTrace: BaseTrace;
    width: number;
    color: string;

    constructor(protected drawingService: DrawingService, protected snapShotService: SnapshotFactoryService) {
        super(drawingService);
        this.width = DEFAULT_TOOL_WIDTH;
    }

    onMouseDown(event: PointerEvent): void {
        if (event.button !== MouseButton.Left) return;
        this.mouseDown = true;
        this.isProcessing = true;
        this.newTrace();
        this.mousePosition = this.getPositionFromMouse(event);
        this.currentTrace.addPoint(this.mousePosition);
        this.drawingService.cleanPreview();
        this.drawingService.drawPreview(this.currentTrace);
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) return;
        if (this.mouseDown) {
            this.isProcessing = false;
            this.stopDrawing();
        }
        this.mouseDown = false;
    }

    onMouseMove(event: PointerEvent): void {
        this.mousePosition = this.getPositionFromMouse(event);

        if (this.mouseDown) {
            this.currentTrace.addPoint(this.mousePosition);
            this.drawingService.cleanPreview();
            this.drawingService.drawPreview(this.currentTrace);
        }
    }

    startDrawing(): void {
        this.newTrace();
    }

    stopDrawing(): void {
        if (!this.mouseDown) return;
        this.drawingService.cleanPreview();
        this.drawingService.drawBase(this.currentTrace);
        this.snapShotService.save(this.currentTrace);
        this.mouseDown = false;
        this.isProcessing = false;
    }

    protected abstract newTrace(): void;
}
