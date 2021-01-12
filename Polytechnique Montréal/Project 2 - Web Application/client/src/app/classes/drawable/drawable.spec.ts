import { DrawableObject } from '@app/classes/drawable/drawable';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';

class DrawableObjectTest extends DrawableObject {
    processDrawing(ctx: CanvasRenderingContext2D): void {
        return;
    }
}
// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('DrawableObject', () => {
    let drawable: DrawableObjectTest;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'save');
        spyOn(ctxStub, 'restore');
        drawable = new DrawableObjectTest();
    });
    it('should be created', () => {
        expect(drawable).toBeTruthy();
    });

    it('#draw should save and restore ctx', () => {
        // Arrange

        // Act
        drawable.draw(ctxStub);

        // Assert
        expect(ctxStub.save).toHaveBeenCalled();
        expect(ctxStub.restore).toHaveBeenCalled();
    });

    it('#drawPreview should save and restore ctx', () => {
        // Arrange

        // Act
        drawable.drawPreview(ctxStub);

        // Assert
        expect(ctxStub.save).toHaveBeenCalled();
        expect(ctxStub.restore).toHaveBeenCalled();
    });

    it('#redraw should save and restore ctx', () => {
        // Arrange

        // Act
        drawable.redraw(ctxStub);

        // Assert
        expect(ctxStub.save).toHaveBeenCalled();
        expect(ctxStub.restore).toHaveBeenCalled();
    });

    it('#processPreviewDrawing calls by default #processDrawing', () => {
        // Arrange
        spyOn<any>(drawable, 'processDrawing');
        // Act
        drawable['processPreviewDrawing'](ctxStub);

        // Assert
        expect(drawable['processDrawing']).toHaveBeenCalled();
    });

    it('#processReDrawing calls by default #processDrawing', () => {
        // Arrange
        spyOn<any>(drawable, 'processDrawing');
        // Act
        drawable['processReDrawing'](ctxStub);

        // Assert
        expect(drawable['processDrawing']).toHaveBeenCalled();
    });
});
