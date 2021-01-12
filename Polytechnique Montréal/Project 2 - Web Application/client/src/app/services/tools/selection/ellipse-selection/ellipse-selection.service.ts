import { Injectable } from '@angular/core';
import { DashedEllipse } from '@app/classes/contour-shape/ellipse/dashed-ellipse';
import { Radius } from '@app/classes/contour-shape/ellipse/ellipse';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { EllipseSelection } from '@app/classes/selection-shape/selection/ellipse-selection/ellipse-selection';
import { ToolType } from '@app/declarations/tool-declarations';
import { SelectionCopy } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService, SELECTION_SIZE_THRESHOLD } from '@app/services/tools/selection/selection.service';
import { TransformationMatrixService } from '@app/services/tools/selection/transformer/transformation-matrix.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { WorkspaceService } from '@app/services/workspace/workspace.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionService extends SelectionService {
    readonly type: ToolType;

    currentSelection: EllipseSelection;

    constructor(
        protected drawingService: DrawingService,
        protected snapshotFactory: SnapshotFactoryService,
        protected boundingBoxS: BoundingBoxService,
        protected mathService: MathUtilsService,
        protected workspaceService: WorkspaceService,
        protected transformationMatrixService: TransformationMatrixService,
        protected snapToGridService: SnapToGridService,
    ) {
        super(drawingService, snapshotFactory, mathService, boundingBoxS, workspaceService, transformationMatrixService, snapToGridService);
        this.type = ToolType.EllipseSelection;
    }

    protected newPaste(selection: SelectionCopy): void {
        super.newPaste(selection);
        const ellipseSelection = selection.selection as EllipseSelection;
        this.currentSelection = new EllipseSelection(
            ellipseSelection.selectionCanvas,
            ellipseSelection.upperLeft,
            ellipseSelection.center,
            this.transformationMatrixService.matrix,
        );
    }

    newSelection(): void {
        this.boundingBoxS.strokeResolution = 0;
        const center = this.mathService.getCenterShape(this.startPoint, this.oppositePoint);
        const radius = this.mathService.getRadiusEllipse(this.startPoint, this.oppositePoint);
        const upperLeft = this.mathService.getRectangleUpperLeft(this.startPoint, this.oppositePoint);
        const canvas = this.newSelectionCanvas(this.getImageDataFromContext(this.drawingService.baseCtx, 0));

        this.currentSelection = new EllipseSelection(canvas, upperLeft, center);

        this.transformationMatrixService.init(this.boundingBoxS.center);
        this.currentSelection.matrix = this.transformationMatrixService.matrix;

        this.addBorderPoints(radius);
    }

    newShape(): void {
        this.currentShape = new DashedEllipse(this.width, this.strokeColor, '', false, false);
    }

    protected isSelectionSmall(): boolean {
        const rx = Math.abs((this.currentShape as DashedEllipse).radius.rx);
        const ry = Math.abs((this.currentShape as DashedEllipse).radius.ry);

        return rx <= SELECTION_SIZE_THRESHOLD || ry <= SELECTION_SIZE_THRESHOLD;
    }

    protected configureShape(): void {
        const center = this.mathService.getCenterShape(this.startPoint, this.oppositePoint);
        const radius = this.mathService.getRadiusEllipse(this.startPoint, this.oppositePoint);
        (this.currentShape as DashedEllipse).center = center;
        (this.currentShape as DashedEllipse).radius = radius;
    }

    protected addBorderPoints(radius: Radius): void {
        // parametric equation of ellipse
        const borderPoints = new Set<Vec2>();
        const minimalResolution = 0.01;
        for (let angle = 0; angle < 2 * Math.PI; angle += minimalResolution) {
            const point = { x: radius.rx * Math.cos(angle), y: radius.ry * Math.sin(angle) };
            borderPoints.add(point);
        }

        this.boundingBoxS.borderPoints = borderPoints;
    }
}
