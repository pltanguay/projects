import { Injectable } from '@angular/core';
import { Calligraphy } from '@app/classes/base-trace/feather-pen/calligraphy/calligraphy';
import { FeatherPen } from '@app/classes/base-trace/feather-pen/feather-pen';
import { ANGLE_OFFSET } from '@app/classes/tool/tool';
import { MAX_ANGLE_FEATHERPEN } from '@app/declarations/sliders-edges';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BaseTraceService } from '@app/services/tools/base-trace/base-trace.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FeatherPenService extends BaseTraceService {
    width: number;
    angle: number;
    color: string;

    private calligraphyPreview: Calligraphy;
    private angleSubject: BehaviorSubject<number>;

    readonly type: ToolType;

    constructor(drawingService: DrawingService, snapshotFactory: SnapshotFactoryService) {
        super(drawingService, snapshotFactory);
        this.type = ToolType.FeatherPen;
        this.initialiseValues();
    }

    private initialiseValues(): void {
        this.angle = 0;
        this.calligraphyPreview = new Calligraphy(this.width, this.angle, this.color);
        this.angleSubject = new BehaviorSubject<number>(this.angle);
        this.newTrace();
    }

    newTrace(): void {
        this.currentTrace = new FeatherPen(this.width, this.angle, this.color);
    }

    getAngleObservable(): Observable<number> {
        return this.angleSubject.asObservable();
    }

    onMouseMove(event: PointerEvent): void {
        this.mousePosition = this.getPositionFromMouse(event);
        (this.currentTrace as FeatherPen).angle = this.angle;
        this.drawCursor();
        this.drawPoint();
    }

    onMouseUp(event: PointerEvent): void {
        this.drawPoint();
        if (this.mouseDown) {
            this.isProcessing = false;
            this.snapShotService.save(this.currentTrace);
        }
        this.mouseDown = false;
    }

    drawPoint(): void {
        if (this.mouseDown) {
            this.isProcessing = true;
            this.currentTrace.addPoint(this.mousePosition);
            this.drawingService.drawBase(this.currentTrace);
        }
    }

    onMouseOut(event: PointerEvent): void {
        if (this.isReallyOut(event)) this.drawingService.cleanPreview();
    }

    onWheelScroll(event: WheelEvent): void {
        this.updateAngle(event.deltaY, event.altKey);
        this.validateLimits();
        this.drawCursor();
        this.angleSubject.next(this.angle);
    }

    private updateAngle(deltaY: number, isAltPressed: boolean): void {
        const angleOffset = isAltPressed ? 1 : ANGLE_OFFSET;

        if (deltaY < 0) {
            this.angle += angleOffset;
        } else if (deltaY > 0) {
            this.angle -= angleOffset;
        }
    }

    private validateLimits(): void {
        if (this.angle < 0) this.angle = MAX_ANGLE_FEATHERPEN;
        if (this.angle > MAX_ANGLE_FEATHERPEN) this.angle = 0;
    }

    private drawCursor(): void {
        this.drawingService.cleanPreview();

        this.calligraphyPreview.setPoint(this.mousePosition);
        this.calligraphyPreview.width = this.width;
        this.calligraphyPreview.angle = this.angle;
        this.calligraphyPreview.color = this.color;

        this.drawingService.drawPreview(this.calligraphyPreview);
    }
}
