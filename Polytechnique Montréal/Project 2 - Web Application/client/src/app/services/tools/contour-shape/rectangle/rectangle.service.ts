import { Injectable } from '@angular/core';
import { Rectangle } from '@app/classes/contour-shape/rectangle/rectangle';
import { ToolType } from '@app/declarations/tool-declarations';
import { DashedShapeService } from '@app/services/dashed-shape/dashed-shape.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { ContourShapeServiceAbs } from '@app/services/tools/contour-shape/contour-shape-abs';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends ContourShapeServiceAbs {
    readonly type: ToolType;

    constructor(
        drawingService: DrawingService,
        snapshotFactory: SnapshotFactoryService,
        protected mathService: MathUtilsService,
        protected dashedShapeService: DashedShapeService,
    ) {
        super(drawingService, snapshotFactory, mathService, dashedShapeService);
        this.type = ToolType.Rectangle;
    }

    protected configureShape(): void {
        const dim = this.mathService.getRectangleDimension(this.startPoint, this.oppositePoint, this.currentShape.width);
        let rectangleUpperLeft = this.mathService.getRectangleUpperLeft(this.startPoint, this.oppositePoint, this.currentShape.width);
        if (!dim.canContourFit) {
            rectangleUpperLeft = this.mathService.getRectangleUpperLeft(this.startPoint, this.oppositePoint);
        }
        (this.currentShape as Rectangle).dimension = dim;
        (this.currentShape as Rectangle).upperLeft = rectangleUpperLeft;
    }

    protected newShape(): void {
        this.currentShape = new Rectangle(this.width, this.strokeColor, this.fillColor, this.withBorder, this.withFill);
    }
}
