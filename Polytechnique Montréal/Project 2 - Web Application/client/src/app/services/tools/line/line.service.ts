import { Injectable } from '@angular/core';
import { Line } from '@app/classes/line/line';
import { DEFAULT_TOOL_WIDTH, Tool } from '@app/classes/tool/tool';
import { MouseButton } from '@app/declarations/mouse.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
export const DEFAULT_RADIUS = 5;
@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private mouseFirstClick: boolean;
    private currentLine: Line;
    private isSingleClick: boolean;

    lineActive: boolean;
    width: number;
    withJunctions: boolean;
    radius: number;
    color: string;

    readonly type: ToolType;

    constructor(drawingService: DrawingService, private snapshotFactory: SnapshotFactoryService, private mathService: MathUtilsService) {
        super(drawingService);
        this.type = ToolType.Line;
        this.mouseFirstClick = false;
        this.isProcessing = this.lineActive = false;
        this.width = DEFAULT_TOOL_WIDTH;
        this.withJunctions = false;
        this.radius = DEFAULT_RADIUS;
        this.newLine();
    }

    onMouseClick(event: MouseEvent): void {
        if (!(event.button === MouseButton.Left)) return;

        this.isSingleClick = true;
        setTimeout(() => {
            if (this.isSingleClick) {
                this.mouseClickHandle(event);
            }
        });
    }

    onMouseMove(event: PointerEvent): void {
        if (!this.drawingStarted()) return;

        this.mousePosition = this.getPositionFromMouse(event);

        this.drawingService.cleanPreview();

        let alignedPosition = this.mathService.getAlignedSegment(this.currentLine.getLastVertex(), this.mousePosition);

        if (!event.shiftKey) alignedPosition = this.mousePosition;

        this.currentLine.addPreviewSegment(alignedPosition);

        this.drawingService.drawPreview(this.currentLine);
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (!(event.button === MouseButton.Left)) return;
        this.isSingleClick = false;
        this.mouseDoubleClickHandle(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.drawingStarted()) return;

        switch (event.key) {
            case 'Shift':
                this.onShiftKeyPressed(event);
                break;
            case 'Backspace':
                this.onBackSpacePressed(event);
                break;
            case 'Escape':
                this.onEscapePressed(event);
                break;
            default:
                break;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!this.drawingStarted()) return;
        if (!(event.key === 'Shift')) return;

        this.drawingService.cleanPreview();

        this.currentLine.addPreviewSegment(this.mousePosition);

        this.drawingService.drawPreview(this.currentLine);
    }

    startDrawing(): void {
        this.newLine();
    }

    stopDrawing(): void {
        if (!this.mouseFirstClick) return;
        this.drawingService.cleanPreview();
        this.drawingService.drawBase(this.currentLine);
        this.snapshotFactory.save(this.currentLine);
        this.mouseFirstClick = false;
        this.isProcessing = this.lineActive = false;
    }

    private drawingStarted(): boolean {
        return this.currentLine.isStarted() && this.mouseFirstClick;
    }

    private mouseClickHandle(event: MouseEvent): void {
        if (!(event.button === MouseButton.Left)) return;
        if (!this.mouseFirstClick) {
            this.newLine();
            this.mouseFirstClick = true;
            this.isProcessing = this.lineActive = true;
        }

        this.mousePosition = this.getPositionFromMouse(event);

        let newSegment = this.mousePosition;

        if (event.shiftKey && this.currentLine.isStarted())
            newSegment = this.mathService.getAlignedSegment(this.currentLine.getLastVertex(), this.mousePosition);

        this.currentLine.addSegment(newSegment);
        this.currentLine.addPreviewSegment(newSegment);

        this.drawingService.cleanPreview();
        this.drawingService.drawPreview(this.currentLine);
    }

    private mouseDoubleClickHandle(event: MouseEvent): void {
        this.mousePosition = this.getPositionFromMouse(event);
        this.stopDrawing();
    }

    private onShiftKeyPressed(event: KeyboardEvent): void {
        this.drawingService.cleanPreview();
        const alignedPosition = this.mathService.getAlignedSegment(this.currentLine.getLastVertex(), this.mousePosition);
        this.currentLine.addPreviewSegment(alignedPosition);
        this.drawingService.drawPreview(this.currentLine);
    }

    private onBackSpacePressed(event: KeyboardEvent): void {
        this.currentLine.removeLastVertex();
        this.currentLine.addPreviewSegment(this.mousePosition);

        this.drawingService.cleanPreview();

        this.drawingService.drawPreview(this.currentLine);
    }

    private onEscapePressed(event: KeyboardEvent): void {
        this.mouseFirstClick = false;
        this.isProcessing = this.lineActive = false;
        this.drawingService.cleanPreview();
    }

    private newLine(): void {
        this.currentLine = new Line(this.width, this.withJunctions, this.radius, this.color);
    }
}
