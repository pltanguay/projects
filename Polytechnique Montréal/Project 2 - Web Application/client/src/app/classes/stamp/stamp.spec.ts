import { Stamp } from '@app/classes/stamp/stamp';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';

// tslint:disable:no-magic-numbers
// tslint:disable:no-any
describe('Stamp', () => {
    let stamp: Stamp;
    let ctxStub: CanvasRenderingContext2D;
    let angle: number;
    let position: Point;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        angle = 15;
        position = { x: 15, y: 15 };
        canvas = ctxStub.canvas;
        stamp = new Stamp(canvas, angle, position);
    });

    it('should be created', () => {
        // Arrange

        // Act

        // Assert
        expect(stamp).toBeTruthy();
    });

    it('#processDrawing should transform and #drawImage', () => {
        // Arrange
        spyOn<any>(ctxStub, 'setTransform');
        spyOn<any>(ctxStub, 'rotate');
        const spyDrawImage = spyOn<any>(ctxStub, 'drawImage');

        // Act
        stamp.processDrawing(ctxStub);

        // Assert
        expect(spyDrawImage).toHaveBeenCalled();
    });
});
