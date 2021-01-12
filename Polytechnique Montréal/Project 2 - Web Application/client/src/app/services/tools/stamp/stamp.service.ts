import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Stamp } from '@app/classes/stamp/stamp';
import {
    ANGLE_OFFSET,
    DEFAULT_ANGLE,
    DEFAULT_CANVAS_HEIGHT,
    DEFAULT_CANVAS_WIDTH,
    DEFAULT_SCALEFACTOR,
    DEFAULT_STAMP_URL,
    Tool,
} from '@app/classes/tool/tool';
import { Point } from '@app/classes/utils/point';
import { MouseButton } from '@app/declarations/mouse.enum';
import { MAX_ANGLE_STAMP } from '@app/declarations/sliders-edges';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { Size } from '@app/services/workspace/workspace.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    angle: number;
    scaleFactor: number;
    stampURL: string;
    isURLDefault: boolean;
    svgSize: Size;

    private stamp: Stamp;
    private angleSubject: BehaviorSubject<number>;
    private renderer: Renderer2;
    private bufferContext: CanvasRenderingContext2D;

    readonly type: ToolType;

    constructor(drawingService: DrawingService, private snapshotFactory: SnapshotFactoryService, rendererFactory: RendererFactory2) {
        super(drawingService);
        this.type = ToolType.Stamp;
        this.renderer = rendererFactory.createRenderer(null, null);
        this.initialiseValues();
    }

    initialiseValues(): void {
        this.stampURL = DEFAULT_STAMP_URL;
        this.isURLDefault = true;
        this.angleSubject = new BehaviorSubject<number>(this.angle);
        this.svgSize = {
            width: DEFAULT_CANVAS_WIDTH,
            height: DEFAULT_CANVAS_HEIGHT,
        };
        this.resetValues();
        this.buildBufferContext();
        this.drawCanvasElementFromSVG();
    }

    resetValues(): void {
        this.angle = DEFAULT_ANGLE;
        this.scaleFactor = DEFAULT_SCALEFACTOR;
    }

    getAngleObservable(): Observable<number> {
        return this.angleSubject.asObservable();
    }

    onMouseDown(event: PointerEvent): void {
        const isLeftClick = event.button === MouseButton.Left;
        if (isLeftClick && !this.isURLDefault) {
            this.drawingService.drawBase(this.stamp);
            this.snapshotFactory.save(this.stamp);
        }
    }

    onMouseMove(event: PointerEvent): void {
        this.mousePosition = this.getPositionFromMouse(event);
        this.drawPreviewStamp(this.mousePosition);
    }

    onMouseOut(event: PointerEvent): void {
        if (this.isReallyOut(event)) this.clearStampPreview();
    }

    onWheelScroll(event: WheelEvent): void {
        if (!this.isURLDefault) {
            this.updateAngle(event.deltaY, event.altKey);
            this.validateLimits();
            this.drawPreviewStamp(this.mousePosition);
            this.angleSubject.next(this.angle);
        }
    }

    clearStampPreview(): void {
        this.drawingService.cleanPreview();
    }

    updateStampPreview(): void {
        this.drawCanvasElementFromSVG();
    }

    private drawCanvasElementFromSVG(): void {
        this.buildBufferContext();
        this.scaleDrawnCanvas();
        this.drawSvgInCanvas();
    }

    private updateAngle(deltaY: number, isAltPressed: boolean): void {
        const angleOffset = isAltPressed ? 1 : ANGLE_OFFSET;

        if (deltaY < 0) this.angle += angleOffset;
        else this.angle -= angleOffset;
    }

    private validateLimits(): void {
        if (this.angle < 0) this.angle = MAX_ANGLE_STAMP;
        if (this.angle > MAX_ANGLE_STAMP) this.angle = 0;
    }

    private drawPreviewStamp(mousePosition: Point): void {
        this.drawingService.cleanPreview();
        this.stamp = new Stamp(this.bufferContext.canvas, this.angle, mousePosition);
        this.drawingService.drawPreview(this.stamp);
    }

    private buildBufferContext(): void {
        const stampCanvas = this.renderer.createElement('canvas') as HTMLCanvasElement;
        this.bufferContext = stampCanvas.getContext('2d') as CanvasRenderingContext2D;
    }

    private scaleDrawnCanvas(): void {
        this.bufferContext.canvas.width = this.svgSize.width * this.scaleFactor;
        this.bufferContext.canvas.height = this.svgSize.height * this.scaleFactor;
    }

    private drawSvgInCanvas(): void {
        const image = new Image();
        image.src = this.stampURL;
        image.onload = () => {
            this.bufferContext.drawImage(image, 0, 0);
        };
        image.crossOrigin = 'Anonymous';
    }
}
