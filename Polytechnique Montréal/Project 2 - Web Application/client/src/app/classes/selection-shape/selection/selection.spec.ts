import { Matrix } from '@app/classes/matrix/matrix';
import { Selection } from '@app/classes/selection-shape/selection/selection';
import { Point } from '@app/classes/utils/point';

class SelectionTest extends Selection {
    constructor(selectionCanvas: HTMLCanvasElement, upperLeft: Point, matrix?: Matrix) {
        super(selectionCanvas, upperLeft, matrix);
    }

    processDrawing(ctx: CanvasRenderingContext2D): void {
        return;
    }

    drawVoid(ctx: CanvasRenderingContext2D): void {
        return;
    }
}

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('Selection', () => {
    let selection: SelectionTest;
    let selectionCanvas: HTMLCanvasElement;

    beforeEach(() => {
        selectionCanvas = document.createElement('canvas');
        const upperLeft = { x: 0, y: 0 };
        const matrix = new Matrix();
        selection = new SelectionTest(selectionCanvas, upperLeft, matrix);
    });

    it('should be created', () => {
        const upperLeft = { x: 0, y: 0 };
        const matrix = new Matrix([
            [1, 2, 2],
            [2, 2, 2],
            [2, 2, 2],
        ]);
        selection = new SelectionTest(selectionCanvas, upperLeft, matrix);
        expect(selection).toBeTruthy();
        expect(selection.matrix).toEqual(matrix);
    });

    it('should be created without matrix argument', () => {
        const upperLeft = { x: 0, y: 0 };
        const matrix = new Matrix([
            [1, 2, 2],
            [2, 2, 2],
            [2, 2, 2],
        ]);

        selection = new SelectionTest(selectionCanvas, upperLeft);

        expect(selection).toBeTruthy();
        expect(selection.matrix).not.toEqual(matrix);
    });
});
