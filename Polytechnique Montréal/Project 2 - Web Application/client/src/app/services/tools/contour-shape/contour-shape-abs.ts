import { ContourShape } from '@app/classes/contour-shape/contour-shape';
import { DEFAULT_TOOL_WIDTH } from '@app/classes/tool/tool';
import { Point } from '@app/classes/utils/point';
import { DashedShapeService } from '@app/services/dashed-shape/dashed-shape.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { BaseShapeService } from '@app/services/tools/base-shape/base-shape.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

export const DASH_SEGMENT = 5;

export abstract class ContourShapeServiceAbs extends BaseShapeService {
    fillColor: string;
    withBorder: boolean = true;
    withFill: boolean = true;

    protected startPoint: Point;
    protected oppositePoint: Point;

    protected currentShape: ContourShape;

    constructor(
        drawingService: DrawingService,
        protected snapshotFactory: SnapshotFactoryService,
        protected mathService: MathUtilsService,
        protected dashedShapeService: DashedShapeService,
    ) {
        super(drawingService, mathService);
        this.width = DEFAULT_TOOL_WIDTH;
        this.newShape();
    }

    stopDrawing(): void {
        if (!this.mouseDown) return;
        this.drawingService.cleanPreview();
        if (this.mouseMove) {
            this.snapshotFactory.save(this.currentShape);
            this.drawingService.drawBase(this.currentShape);
        }

        this.newShape();
        this.mouseDown = false;
        this.isTransformed = false;
    }

    protected drawPreview(): void {
        const dashedRectangle = this.dashedShapeService.getDashedRectangle(this.startPoint, this.mousePosition);
        this.drawingService.drawPreview(dashedRectangle);
    }

    protected updateView(): void {
        this.configureShape();
        this.drawingService.cleanPreview();
        this.drawPreview();
        this.drawingService.drawPreview(this.currentShape);
    }
}
