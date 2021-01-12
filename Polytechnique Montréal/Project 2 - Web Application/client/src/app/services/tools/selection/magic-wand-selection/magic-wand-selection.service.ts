import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color/color';
import { Dimension } from '@app/classes/interfaces/dimension';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { MagicWandSelection } from '@app/classes/selection-shape/selection/magic-wand-selection/magic-wand-selection';
import { pickColorsFromCanvas } from '@app/classes/utils/canvas-helper';
import { MouseButton } from '@app/declarations/mouse.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { SelectionCopy } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { TransformationMatrixService } from '@app/services/tools/selection/transformer/transformation-matrix.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { WorkspaceService } from '@app/services/workspace/workspace.service';
import { MagicSelectionResult, MagicWandAlgorithmService } from './magic-wand-algorithm.service';

@Injectable({
    providedIn: 'root',
})
export class MagicWandSelectionService extends SelectionService {
    readonly type: ToolType;
    canvasSize: Dimension;

    constructor(
        protected drawingService: DrawingService,
        protected snapshotFactory: SnapshotFactoryService,
        protected boundingBoxS: BoundingBoxService,
        protected mathService: MathUtilsService,
        protected workspaceService: WorkspaceService,
        protected selectionAlgorithmService: MagicWandAlgorithmService,
        protected transformationMatrixService: TransformationMatrixService,
        protected snapToGridService: SnapToGridService,
    ) {
        super(drawingService, snapshotFactory, mathService, boundingBoxS, workspaceService, transformationMatrixService, snapToGridService);
        this.type = ToolType.MagicWandSelection;
    }

    onMouseDown(event: PointerEvent): void {
        this.drawingService.cleanPreview();

        if (this.selectionActive) return;
        event.stopPropagation();

        const params = this.getParams(event);

        let result: MagicSelectionResult;
        if (event.button === MouseButton.Left) {
            result = this.selectionAlgorithmService.onMouseLeft(params[0], params[1], params[2]);
        } else {
            result = this.selectionAlgorithmService.onMouseRight(params[0], params[1]);
        }

        this.createNewView(result);
        this.selectionActive = this.isProcessing = true;
    }

    protected newPaste(selection: SelectionCopy): void {
        super.newPaste(selection);
        const magicSelection = selection.selection as MagicWandSelection;

        this.currentSelection = new MagicWandSelection(
            magicSelection.selectionCanvas,
            magicSelection.previewSelectionCanvas,
            magicSelection.imageData,
            this.transformationMatrixService.matrix,
        );
    }

    protected createNewView(state: MagicSelectionResult): void {
        this.updateBoundingBox(state);

        this.createNewSelection(state);

        this.transformationMatrixService.init(this.boundingBoxS.center);
        this.currentSelection.matrix = this.transformationMatrixService.transformationMatrix;
        this.drawingService.drawPreview(this.currentSelection);
    }

    private updateBoundingBox(state: MagicSelectionResult): void {
        this.boundingBoxS.strokeResolution = 2;
        this.boundingBoxS.top = state.boxBorders.top;
        this.boundingBoxS.left = state.boxBorders.left;
        this.boundingBoxS.dimension = {
            width: state.boxBorders.right - state.boxBorders.left,
            height: state.boxBorders.bottom - state.boxBorders.top,
        };

        this.addBoxBorderPoints(state);
    }

    private createNewSelection(state: MagicSelectionResult): void {
        const canvas = this.createSelectionCanvas(state.selectionCanvasArray, state.borderPath);

        const arrayByte = new Uint8ClampedArray(state.clippedSelectionArray.buffer);
        const imageData = new ImageData(arrayByte, this.drawingService.canvasWidth, this.drawingService.canvasHeight);

        this.currentSelection = new MagicWandSelection(canvas[0], canvas[1], imageData);
    }

    protected createSelectionCanvas(dataArray: Uint32Array, strokePath: Path2D): [HTMLCanvasElement, HTMLCanvasElement] {
        const imageDatas = this.getClippedImageDatas(dataArray, strokePath);
        const baseSelectioncanvas = this.newSelectionCanvas(imageDatas[0]);

        const previewSelectioncanvas2 = this.newSelectionCanvas(imageDatas[1]);

        return [baseSelectioncanvas, previewSelectioncanvas2];
    }

    private getClippedImageDatas(dataArray: Uint32Array, strokePath: Path2D): [ImageData, ImageData] {
        const tmpCanvas = this.renderer.createElement('canvas') as HTMLCanvasElement;
        tmpCanvas.width = this.drawingService.canvasWidth;
        tmpCanvas.height = this.drawingService.canvasHeight;
        const tmpContext = tmpCanvas.getContext('2d') as CanvasRenderingContext2D;

        const arrayByte = new Uint8ClampedArray(dataArray.buffer);
        tmpContext.putImageData(new ImageData(arrayByte, tmpCanvas.width, tmpCanvas.height), 0, 0);

        const baseSelectionImageData = this.getImageDataFromContext(tmpContext, 0);

        tmpContext.strokeStyle = 'black';
        tmpContext.stroke(strokePath);

        const previewSelectionImageData = this.getImageDataFromContext(tmpContext, 2);

        return [baseSelectionImageData, previewSelectionImageData];
    }

    private getParams(event: PointerEvent): [ImageData, Color, number] {
        this.canvasSize = { width: this.drawingService.canvasWidth, height: this.drawingService.canvasHeight };

        const imageData = this.drawingService.baseCtx.getImageData(0, 0, this.canvasSize.width, this.canvasSize.height);

        let mouseDown = this.getPositionFromMouse(event);
        mouseDown = { x: Math.ceil(mouseDown.x), y: Math.ceil(mouseDown.y) };
        const indexOneDimensional = mouseDown.y * this.canvasSize.width + mouseDown.x;

        const color = pickColorsFromCanvas(mouseDown, 1, 1, this.drawingService.baseCtx)[0];

        return [imageData, color, indexOneDimensional];
    }

    private addBoxBorderPoints(state: MagicSelectionResult): void {
        const translatedBorderPoints = new Set<Vec2>();
        const center = this.boundingBoxS.center;
        for (const vec of state.borderPoints.values()) {
            translatedBorderPoints.add({ x: vec.x - center.x, y: vec.y - center.y });
        }
        this.boundingBoxS.borderPoints = translatedBorderPoints;
    }
}
