import { Injectable } from '@angular/core';
import { Polygone } from '@app/classes/contour-shape/polygone/polygone';
import { Point } from '@app/classes/utils/point';
import { ToolType } from '@app/declarations/tool-declarations';
import { DashedShapeService } from '@app/services/dashed-shape/dashed-shape.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { ContourShapeServiceAbs } from '@app/services/tools/contour-shape/contour-shape-abs';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

export const DASH_SEGMENT = 5;
export const DEFAULT_POLYGONE_SIDES = 3;

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends ContourShapeServiceAbs {
    readonly type: ToolType;

    numberOfSides: number;

    constructor(
        drawingService: DrawingService,
        protected snapshotFactory: SnapshotFactoryService,
        protected mathService: MathUtilsService,
        protected dashedShapeService: DashedShapeService,
    ) {
        super(drawingService, snapshotFactory, mathService, dashedShapeService);
        this.type = ToolType.Polygone;
        this.numberOfSides = DEFAULT_POLYGONE_SIDES;
    }

    protected drawPreview(): void {
        const dashedEllipse = this.dashedShapeService.getDashedEllipse(this.startPoint, this.mousePosition, true);
        this.drawingService.drawPreview(dashedEllipse);
        return;
    }

    protected configureShape(): void {
        this.oppositePoint = this.mathService.transformRectangleToSquare(this.startPoint, this.oppositePoint);
        const center = this.mathService.getCenterShape(this.startPoint, this.oppositePoint);
        const radius = this.mathService.getRadiusPolygone(this.startPoint, this.oppositePoint, this.currentShape.width, this.numberOfSides);
        (this.currentShape as Polygone).center = center;
        (this.currentShape as Polygone).radius.r = radius.rx;
        (this.currentShape as Polygone).radius.canContourFit = radius.canContourFit;
        (this.currentShape as Polygone).yAxisSign = Math.sign(this.oppositePoint.y - this.startPoint.y);
    }

    protected transformShapeAlgorithm(startPoint: Point, oppositePoint: Point): Point {
        return this.oppositePoint;
    }

    protected newShape(): void {
        this.currentShape = new Polygone(this.width, this.strokeColor, this.fillColor, this.withBorder, this.withFill, this.numberOfSides);
    }
}
