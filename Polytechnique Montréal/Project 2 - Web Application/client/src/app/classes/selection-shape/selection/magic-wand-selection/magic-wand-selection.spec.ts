import { Matrix } from '@app/classes/matrix/matrix';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { MagicWandSelection } from './magic-wand-selection';
// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('MagicWandSelection', () => {
    let magicWandSelection: MagicWandSelection;
    let selectionCanvas: HTMLCanvasElement;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'setTransform');
        spyOn(ctxStub, 'drawImage');
        spyOn(ctxStub, 'putImageData');

        selectionCanvas = document.createElement('canvas');
        selectionCanvas.width = 2;
        selectionCanvas.height = 2;
        magicWandSelection = new MagicWandSelection(selectionCanvas, selectionCanvas, new ImageData(1, 1));
        magicWandSelection.matrix = new Matrix();
    });

    it('should be created', () => {
        expect(magicWandSelection).toBeTruthy();
    });

    it('#processDrawing should draw white on background', () => {
        // Arrange
        spyOn<any>(magicWandSelection, 'drawVoid');

        // Act
        magicWandSelection['processDrawing'](ctxStub);

        // Assert
        expect(magicWandSelection['drawVoid']).toHaveBeenCalled();
    });

    it('#processDrawing should draw clipped canvas selection', () => {
        // Act
        magicWandSelection['processDrawing'](ctxStub);

        // Assert
        expect(ctxStub.drawImage).toHaveBeenCalled();
    });

    it('#drawVoid should put image', () => {
        // Arrange

        // Act
        magicWandSelection['drawVoid'](ctxStub);

        // Assert
        expect(ctxStub.putImageData).toHaveBeenCalled();
    });

    it('#drawVoid should not be called if ellipse is pasted', () => {
        // Arrange
        magicWandSelection.pasted = true;
        magicWandSelection['strokeDrawed'] = true;
        spyOn<any>(magicWandSelection, 'drawVoid');

        // Act
        magicWandSelection['processPreviewDrawing'](ctxStub);

        // Assert
        expect(magicWandSelection['drawVoid']).not.toHaveBeenCalled();
    });

    it('#processPreviewDrawing should not draw image if deleted', () => {
        // Arrange
        magicWandSelection.pasted = true;
        magicWandSelection.deleted = true;

        // Act
        magicWandSelection['processPreviewDrawing'](ctxStub);

        // Assert
        expect(ctxStub.drawImage).not.toHaveBeenCalled();
    });
});
