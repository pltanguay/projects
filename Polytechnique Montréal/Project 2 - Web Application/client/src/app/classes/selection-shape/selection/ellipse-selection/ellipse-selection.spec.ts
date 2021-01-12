import { Matrix } from '@app/classes/matrix/matrix';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { EllipseSelection } from './ellipse-selection';
// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('EllipseSelection', () => {
    let ellipseSelection: EllipseSelection;
    let selectionCanvas: HTMLCanvasElement;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'beginPath');
        spyOn(ctxStub, 'ellipse');
        spyOn(ctxStub, 'clip');
        spyOn(ctxStub, 'drawImage');
        spyOn(ctxStub, 'fill');

        const upperLeft = { x: 0, y: 0 };
        const center = { x: 0, y: 0 };
        selectionCanvas = document.createElement('canvas');
        selectionCanvas.width = 2;
        selectionCanvas.height = 2;
        ellipseSelection = new EllipseSelection(selectionCanvas, upperLeft, center);
        ellipseSelection.matrix = new Matrix();
    });
    it('should be created', () => {
        expect(ellipseSelection).toBeTruthy();
    });

    it('#processDrawing should draw white on background', () => {
        // Arrange
        spyOn<any>(ellipseSelection, 'drawVoid');

        // Act
        ellipseSelection['processDrawing'](ctxStub);

        // Assert
        expect(ellipseSelection['drawVoid']).toHaveBeenCalled();
    });

    it('#processDrawing should draw clipped canvas selection', () => {
        // Act
        ellipseSelection['processDrawing'](ctxStub);

        // Assert
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.ellipse).toHaveBeenCalled();
        expect(ctxStub.clip).toHaveBeenCalled();
        expect(ctxStub.drawImage).toHaveBeenCalled();
    });

    it('#drawVoid should draw white background', () => {
        // Arrange

        // Act
        ellipseSelection['drawVoid'](ctxStub);

        // Assert
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.ellipse).toHaveBeenCalled();
        expect(ctxStub.fill).toHaveBeenCalled();
        expect(ctxStub.fillStyle).toBe('#ffffff');
    });

    it('#drawVoid should draw white background at ellipse center', () => {
        // Arrange

        // Act
        ellipseSelection['drawVoid'](ctxStub);

        // Assert
        expect(ctxStub.ellipse).toHaveBeenCalledWith(ellipseSelection['center'].x, ellipseSelection['center'].y, 1, 1, 0, 0, 2 * Math.PI);
    });

    it('#drawVoid should not be called if ellipse is pasted', () => {
        // Arrange
        ellipseSelection.pasted = true;
        spyOn<any>(ellipseSelection, 'drawVoid');

        // Act
        ellipseSelection['processDrawing'](ctxStub);

        // Assert
        expect(ellipseSelection['drawVoid']).not.toHaveBeenCalled();
    });

    it('#processDrawing should not draw image if deleted', () => {
        // Arrange
        ellipseSelection.pasted = true;
        ellipseSelection.deleted = true;

        // Act
        ellipseSelection['processDrawing'](ctxStub);

        // Assert
        expect(ctxStub.drawImage).not.toHaveBeenCalled();
    });
});
