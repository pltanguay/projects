import { Injectable } from '@angular/core';
import { DashedRectangle } from '@app/classes/contour-shape/rectangle/dashed-rectangle';
import { RectangleSelection } from '@app/classes/selection-shape/selection/rectangle-selection/rectangle-selection';
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
export class RectangleSelectionService extends SelectionService {
    readonly type: ToolType;

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
        this.type = ToolType.RectangleSelection;
    }

    newShape(): void {
        this.currentShape = new DashedRectangle(this.width, this.strokeColor, '', false, false);
    }

    protected newSelection(): void {
        this.newRectangleSelection();
    }

    protected newPaste(selection: SelectionCopy): void {
        super.newPaste(selection);
        const rectSelection = selection.selection as RectangleSelection;
        this.currentSelection = new RectangleSelection(
            rectSelection.selectionCanvas,
            rectSelection.upperLeft,
            this.transformationMatrixService.matrix,
        );
    }

    protected isSelectionSmall(): boolean {
        const width = Math.abs((this.currentShape as DashedRectangle).dimension.width);
        const height = Math.abs((this.currentShape as DashedRectangle).dimension.height);

        return width <= SELECTION_SIZE_THRESHOLD || height <= SELECTION_SIZE_THRESHOLD;
    }

    protected configureShape(): void {
        (this.currentShape as DashedRectangle).upperLeft = this.mathService.getRectangleUpperLeft(this.startPoint, this.oppositePoint);
        (this.currentShape as DashedRectangle).dimension = this.mathService.getRectangleDimension(this.startPoint, this.oppositePoint);
    }
}
