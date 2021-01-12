import { Matrix } from '@app/classes/matrix/matrix';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { RectangleSelection } from './rectangle-selection';
// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('RectangleSelection', () => {
    let rectangleSelection: RectangleSelection;
    let selectionCanvas: HTMLCanvasElement;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'beginPath');
        spyOn(ctxStub, 'drawImage');
        spyOn(ctxStub, 'fillRect');

        const upperLeft = { x: 0, y: 0 };
        selectionCanvas = document.createElement('canvas');
        rectangleSelection = new RectangleSelection(selectionCanvas, upperLeft);
        rectangleSelection.matrix = new Matrix();
    });
    it('should be created', () => {
        expect(rectangleSelection).toBeTruthy();
    });

    it('#processDrawing should draw white on background', () => {
        // Arrange
        spyOn<any>(rectangleSelection, 'drawVoid');

        // Act
        rectangleSelection['processDrawing'](ctxStub);

        // Assert
        expect(rectangleSelection['drawVoid']).toHaveBeenCalled();
    });

    it('#processDrawing should draw canvas selection', () => {
        // Act
        rectangleSelection['processDrawing'](ctxStub);

        // Assert
        expect(ctxStub.drawImage).toHaveBeenCalled();
    });

    it('#drawVoid should draw white background', () => {
        // Arrange

        // Act
        rectangleSelection['drawVoid'](ctxStub);

        // Assert
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.fillRect).toHaveBeenCalled();
        expect(ctxStub.fillStyle).toBe('#ffffff');
    });

    it('#drawVoid should draw white background at rectangle center', () => {
        // Arrange

        // Act
        rectangleSelection['drawVoid'](ctxStub);

        // Assert
        expect(ctxStub.fillRect).toHaveBeenCalledWith(
            rectangleSelection.upperLeft.x,
            rectangleSelection.upperLeft.y,
            rectangleSelection['selectionCanvas'].width,
            rectangleSelection['selectionCanvas'].height,
        );
    });

    it('#drawVoid should not be called if ellipse is pasted', () => {
        // Arrange
        rectangleSelection.pasted = true;
        spyOn<any>(rectangleSelection, 'drawVoid');

        // Act
        rectangleSelection['processDrawing'](ctxStub);

        // Assert
        expect(rectangleSelection['drawVoid']).not.toHaveBeenCalled();
    });

    it('#processDrawing should not draw image if deleted', () => {
        // Arrange
        rectangleSelection.pasted = true;
        rectangleSelection.deleted = true;

        // Act
        rectangleSelection['processDrawing'](ctxStub);

        // Assert
        expect(ctxStub.drawImage).not.toHaveBeenCalled();
    });
});
