import { DrawableObject } from '@app/classes/drawable/drawable';
import { Dimension } from '@app/classes/interfaces/dimension';
import { Matrix } from '@app/classes/matrix/matrix';
import { Point } from '@app/classes/utils/point';

export abstract class Selection extends DrawableObject {
    upperLeft: Point;
    matrix: Matrix;
    initialCanvasDimension: Dimension;
    selectionCanvas: HTMLCanvasElement;
    deleted: boolean;
    pasted: boolean;

    constructor(selectionCanvas: HTMLCanvasElement, upperLeft: Point, matrix?: Matrix) {
        super();
        this.selectionCanvas = selectionCanvas;
        this.upperLeft = upperLeft;
        this.initialCanvasDimension = { width: selectionCanvas.width, height: selectionCanvas.height };
        this.deleted = false;
        this.pasted = false;
        if (matrix) {
            this.matrix = matrix;
            return;
        }
        this.matrix = new Matrix();
    }

    abstract drawVoid(ctx: CanvasRenderingContext2D): void;
}
