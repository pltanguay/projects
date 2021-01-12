import { Pencil } from '@app/classes/base-trace/pencil/pencil';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';

// tslint:disable:no-magic-numbers
describe('Pencil', () => {
    let pencil: Pencil;
    let width: number;
    let color: string;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        width = 15;
        color = '#ffeedd';
        pencil = new Pencil(width, color);
    });

    it('should be created', () => {
        expect(pencil).toBeTruthy();
    });

    it('#setContextAttribute should set context fillStyle color', () => {
        // Arrange

        // Act
        pencil.setContextAttribute(ctxStub);

        // Assert
        expect(ctxStub.fillStyle).toBe(color);
    });
});
