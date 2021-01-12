import { Injectable } from '@angular/core';
import { Ellipse } from '@app/classes/contour-shape/ellipse/ellipse';
import { ToolType } from '@app/declarations/tool-declarations';
import { DashedShapeService } from '@app/services/dashed-shape/dashed-shape.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { ContourShapeServiceAbs } from '@app/services/tools/contour-shape/contour-shape-abs';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

export const DASH_SEGMENT = 5;

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ContourShapeServiceAbs {
    readonly type: ToolType;

    constructor(
        drawingService: DrawingService,
        protected snapshotFactory: SnapshotFactoryService,
        protected mathService: MathUtilsService,
        protected dashedShapeService: DashedShapeService,
    ) {
        super(drawingService, snapshotFactory, mathService, dashedShapeService);
        this.type = ToolType.Ellipse;
    }

    protected configureShape(): void {
        const center = this.mathService.getCenterShape(this.startPoint, this.oppositePoint);
        const radius = this.mathService.getRadiusEllipse(this.startPoint, this.oppositePoint, this.currentShape.width);
        (this.currentShape as Ellipse).center = center;
        (this.currentShape as Ellipse).radius = radius;
    }

    protected newShape(): void {
        this.currentShape = new Ellipse(this.width, this.strokeColor, this.fillColor, this.withBorder, this.withFill);
    }
}
