import { BaseShape } from '@app/classes/base-shape/base-shape';
import { DEFAULT_TOOL_WIDTH, Tool } from '@app/classes/tool/tool';
import { Point } from '@app/classes/utils/point';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { MouseButton } from '@app/declarations/mouse.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';

export const DASH_SEGMENT = 5;

export abstract class BaseShapeService extends Tool {
    width: number;
    strokeColor: string;

    protected isTransformed: boolean;
    protected startPoint: Point;
    protected oppositePoint: Point;

    protected currentShape: BaseShape;
    protected mouseMove: boolean;

    constructor(drawingService: DrawingService, protected mathService: MathUtilsService) {
        super(drawingService);
        this.width = DEFAULT_TOOL_WIDTH;
        this.newShape();
    }

    protected abstract newShape(): void;
    protected abstract configureShape(): void;

    startDrawing(): void {
        this.newShape();
    }

    onMouseDown(event: PointerEvent): void {
        if (event.button !== MouseButton.Left) return;
        this.newShape();
        this.mousePosition = this.getPositionFromMouse(event);
        this.startPoint = this.mousePosition;
        this.mouseDown = true;
        this.isProcessing = true;
    }

    onMouseMove(event: PointerEvent): void {
        if (this.mouseDown) {
            this.mousePosition = this.getPositionFromMouse(event);
            this.mouseMove = true;
            this.changeOppositePoint();
            this.updateView();
        }
    }

    onMouseUp(event: PointerEvent): void {
        if (event.button !== MouseButton.Left) return;
        if (this.mouseDown) {
            this.isProcessing = false;
            this.mousePosition = this.getPositionFromMouse(event);
            this.changeOppositePoint();
            this.configureShape();
            this.stopDrawing();
        }
        this.mouseDown = false;
        this.mouseMove = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.mouseDown) return;
        if (event.key === Keyboard.ESC) {
            this.mouseDown = false;
            this.drawingService.cleanPreview();
            return;
        }
        if (event.key !== 'Shift') return;

        this.transformShape();
        this.updateView();
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!this.mouseDown) return;
        if (event.key !== 'Shift') return;

        this.restoreShape();
        this.updateView();
    }

    protected updateView(): void {
        this.configureShape();
        this.drawingService.cleanPreview();
        this.drawingService.drawPreview(this.currentShape);
    }

    protected changeOppositePoint(): void {
        this.oppositePoint = this.mousePosition;

        if (!this.isTransformed) return;
        this.oppositePoint = this.transformShapeAlgorithm(this.startPoint, this.oppositePoint);
    }
    protected transformShape(): void {
        this.isTransformed = true;
        this.oppositePoint = this.transformShapeAlgorithm(this.startPoint, this.oppositePoint);
    }

    protected restoreShape(): void {
        this.isTransformed = false;
        this.oppositePoint = this.mousePosition;
    }

    protected transformShapeAlgorithm(startPoint: Point, oppositePoint: Point): Point {
        return this.mathService.transformRectangleToSquare(startPoint, oppositePoint);
    }
}
