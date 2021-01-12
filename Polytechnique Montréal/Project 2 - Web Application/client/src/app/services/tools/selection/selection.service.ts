import { Injectable, Renderer2 } from '@angular/core';
import { Radius } from '@app/classes/contour-shape/ellipse/ellipse';
import { Dimension } from '@app/classes/interfaces/dimension';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { RectangleSelection } from '@app/classes/selection-shape/selection/rectangle-selection/rectangle-selection';
import { Selection } from '@app/classes/selection-shape/selection/selection';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { SelectionCopy } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { BaseShapeService } from '@app/services/tools/base-shape/base-shape.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { WorkspaceService } from '@app/services/workspace/workspace.service';
import { ArrowMove } from './transformer/arrow-move';
import { TransformationMatrixService } from './transformer/transformation-matrix.service';

export const SELECTION_PREVIEW_WIDTH = 1;
export const SELECTION_SIZE_THRESHOLD = 4;
export const ROTATION_STEP = 15;

@Injectable({
    providedIn: 'root',
})
export abstract class SelectionService extends BaseShapeService {
    protected mouseMove: boolean;
    protected selectionTransformed: boolean;

    selectionActive: boolean;
    renderer: Renderer2;
    currentSelection: Selection;
    moveTransformer: ArrowMove;
    angle: number = 0;

    constructor(
        protected drawingService: DrawingService,
        protected snapshotFactory: SnapshotFactoryService,
        protected mathService: MathUtilsService,
        protected boundingBoxS: BoundingBoxService,
        protected workspaceService: WorkspaceService,
        protected transformationMatrixService: TransformationMatrixService,
        protected snapToGridService: SnapToGridService,
    ) {
        super(drawingService, mathService);

        this.width = SELECTION_PREVIEW_WIDTH;
        this.mouseMove = this.selectionActive = this.selectionTransformed = false;
        this.newShape();
        this.moveTransformer = new ArrowMove(this, this.transformationMatrixService, this.boundingBoxS, this.snapToGridService);
    }

    protected isSelectionSmall(): boolean {
        return false;
    }
    protected newSelection(): void {
        return;
    }
    protected newShape(): void {
        return;
    }
    protected configureShape(): void {
        return;
    }

    onMouseDown(event: PointerEvent): void {
        super.onMouseDown(event);

        if (this.selectionActive && this.selectionTransformed) this.confirmSelection();

        this.drawingService.cleanPreview();
        this.mouseMove = this.selectionActive = this.isProcessing = false;
    }

    onMouseMove(event: PointerEvent): void {
        this.mousePosition = this.getPositionFromMouse(event);

        if (this.mouseDown) {
            this.mouseMove = true;
            this.isProcessing = true;
            this.changeOppositePoint();
            this.updateView();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (!this.mouseDown) return;
        this.mouseDown = false;

        this.transformationMatrixService.reset();
        this.angle = 0;

        if (!this.mouseMove) return;

        if (this.isSelectionSmall()) {
            this.stopDrawing();
            return;
        }

        this.mousePosition = this.getPositionFromMouse(event);
        this.changeOppositePoint();
        this.configureShape();

        this.selectionActive = this.isProcessing = true;
        this.mouseMove = this.isTransformed = false;

        this.drawBoundingBox();
        this.newSelection();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === Keyboard.ESC) {
            if (this.selectionActive && this.selectionTransformed) this.confirmSelection();
            this.escapeKeyPress();
            return;
        }

        if (event.key === Keyboard.A && event.ctrlKey) {
            this.selectAll();
            return;
        }
        const isArrowPressed = this.moveTransformer.arrowPressed(event.key);
        if (this.selectionActive && isArrowPressed) {
            this.drawingService.cleanPreview();
            this.moveTransformer.keyDown(event);
            this.selectionTransformed = true;
            this.drawingService.drawPreview(this.currentSelection);
        }
        super.onKeyDown(event);
        this.workspaceService.setOverflow('hidden');
    }

    onKeyUp(event: KeyboardEvent): void {
        super.onKeyUp(event);
        this.moveTransformer.keyUp(event);
        this.workspaceService.setOverflow('auto');
    }

    onWheelScroll(event: WheelEvent): void {
        if (!this.selectionActive) return;
        this.boundingBoxS.strokeResolution = 0;
        this.angle = (event.altKey ? 1 : ROTATION_STEP) * Math.sign(event.deltaY);
        if (!this.boundingBoxS.centerRotation) {
            this.boundingBoxS.centerRotation = this.boundingBoxS.center;
        }
        const center = this.boundingBoxS.centerRotation;
        this.transformationMatrixService.rotate(this.angle, center.x, center.y);

        const matrix = this.transformationMatrixService.matrix;
        this.boundingBoxS.applyMatrixOnBorderPoints(matrix); // resize bounding box after rotation
        this.currentSelection.matrix = matrix;
        this.drawingService.cleanPreview();
        this.drawingService.drawPreview(this.currentSelection);
        this.selectionTransformed = true;
    }

    startDrawing(): void {
        this.newShape();
    }

    stopDrawing(): void {
        if (this.selectionActive && this.selectionTransformed) this.confirmSelection();
        this.drawingService.cleanPreview();
        this.selectionActive = this.isProcessing = this.isTransformed = this.mouseDown = false;
        this.newShape();
    }

    selectAll(): void {
        this.isProcessing = true;

        if (this.selectionActive && this.selectionTransformed) this.confirmSelection();

        this.drawingService.cleanPreview();
        this.selectionActive = true;

        this.startPoint = { x: 0, y: 0 };
        this.oppositePoint = { x: this.drawingService.canvasWidth, y: this.drawingService.canvasHeight };

        this.boundingBoxS.top = 0;
        this.boundingBoxS.left = 0;
        this.boundingBoxS.dimension = { width: this.oppositePoint.x, height: this.oppositePoint.y };

        this.newRectangleSelection();
    }

    protected newRectangleSelection(): void {
        this.boundingBoxS.strokeResolution = 0;
        const upperLeft = this.mathService.getRectangleUpperLeft(this.startPoint, this.oppositePoint);
        const imageData = this.getImageDataFromContext(this.drawingService.baseCtx, 0);
        const canvas = this.newSelectionCanvas(imageData);

        this.currentSelection = new RectangleSelection(canvas, upperLeft);

        const center = this.mathService.getCenterShape(this.startPoint, this.oppositePoint);
        this.transformationMatrixService.init(center);
        this.currentSelection.matrix = this.transformationMatrixService.matrix;

        this.addBorderPoints({ width: canvas.width, height: canvas.height });
    }

    protected getImageDataFromContext(tmpContext: CanvasRenderingContext2D, strokeResolution: number): ImageData {
        return tmpContext.getImageData(
            this.boundingBoxS.left - strokeResolution,
            this.boundingBoxS.top - strokeResolution,
            this.boundingBoxS.dimension.width + strokeResolution * 2,
            this.boundingBoxS.dimension.height + strokeResolution * 2,
        );
    }

    protected newSelectionCanvas(imageData: ImageData): HTMLCanvasElement {
        const canvas = this.renderer.createElement('canvas') as HTMLCanvasElement;
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.putImageData(imageData, 0, 0);

        return canvas;
    }

    moveSelection(translation: Vec2): void {
        this.drawingService.cleanPreview();
        this.boundingBoxS.strokeResolution = 0;
        this.boundingBoxS.centerRotation = undefined;
        this.transformationMatrixService.translate(translation.x, translation.y);

        this.currentSelection.matrix = this.transformationMatrixService.matrix;
        this.drawingService.drawPreview(this.currentSelection);

        this.selectionTransformed = true;
    }

    scale(sx: number, sy: number, tx: number, ty: number, center: Vec2): void {
        this.drawingService.cleanPreview();
        this.boundingBoxS.strokeResolution = 0;
        this.boundingBoxS.centerRotation = undefined;

        this.transformationMatrixService.translate(-center.x, -center.y);
        this.transformationMatrixService.scale(sx, sy, tx, ty);
        this.transformationMatrixService.translate(center.x, center.y);

        const matrix = this.transformationMatrixService.matrix;
        if (tx === 0 && ty === 0) this.boundingBoxS.applyMatrixOnBorderPoints(matrix);

        this.currentSelection.matrix = matrix;
        this.drawingService.drawPreview(this.currentSelection);

        this.selectionTransformed = true;
    }

    terminateSelection(): void {
        this.mouseDown = false;

        if (this.selectionActive && this.selectionTransformed) {
            this.confirmSelection();
        }

        this.drawingService.cleanPreview();

        this.mouseMove = this.selectionActive = this.isProcessing = false;
    }

    protected newPaste(selection: SelectionCopy): void {
        this.transformationMatrixService.setMatrix(selection.matrix.clone());
    }

    paste(selection: SelectionCopy): void {
        this.terminateSelection();
        this.newPaste(selection);

        this.currentSelection.deleted = false;
        this.currentSelection.pasted = true;

        this.boundingBoxS.borderPoints = selection.borderPoints;
        this.boundingBoxS.applyMatrixOnBorderPoints(this.transformationMatrixService.matrix);

        this.drawingService.cleanPreview();
        this.drawingService.drawPreview(this.currentSelection);
        this.selectionTransformed = this.mouseMove = this.selectionActive = this.isProcessing = true;
    }

    delete(): void {
        this.selectionTransformed = true;
        this.currentSelection.deleted = true;
        this.terminateSelection();
    }

    protected confirmSelection(): void {
        this.drawingService.drawBase(this.currentSelection);
        this.snapshotFactory.save(this.currentSelection);
        this.selectionTransformed = false;
        this.boundingBoxS.centerRotation = undefined;
    }

    protected drawBoundingBox(): void {
        this.drawingService.cleanPreview();
        const upperLeft = this.mathService.getRectangleUpperLeft(this.startPoint, this.oppositePoint);
        const dimension = this.mathService.getRectangleDimension(this.startPoint, this.oppositePoint);
        this.boundingBoxS.strokeResolution = 0;
        this.boundingBoxS.left = upperLeft.x;
        this.boundingBoxS.top = upperLeft.y;
        this.boundingBoxS.dimension = { width: dimension.width, height: dimension.height };
    }

    protected getPositionFromMouse(event: MouseEvent): Vec2 {
        return {
            x: event.offsetX < 0 ? 0 : Math.min(event.offsetX, this.drawingService.canvasWidth),
            y: event.offsetY < 0 ? 0 : Math.min(event.offsetY, this.drawingService.canvasHeight),
        };
    }

    escapeKeyPress(): void {
        this.mouseDown = this.selectionActive = this.isProcessing = false;
        this.drawingService.cleanPreview();
    }

    protected addBorderPoints(param: Dimension | Radius): void {
        const borderPoints = new Set<Vec2>();
        const width = (param as Dimension).width;
        const height = (param as Dimension).height;
        borderPoints.add({ x: -width / 2, y: -height / 2 });
        borderPoints.add({ x: -width / 2, y: +height / 2 });
        borderPoints.add({ x: +width / 2, y: -height / 2 });
        borderPoints.add({ x: +width / 2, y: +height / 2 });
        this.boundingBoxS.borderPoints = borderPoints;
    }
}
