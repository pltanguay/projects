import { Spray } from '@app/classes/base-trace/spray/spray';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';

// tslint:disable:no-magic-numbers
describe('Pencil', () => {
    let spray: Spray;
    let width: number;
    let color: string;
    let ctxStub: CanvasRenderingContext2D;
    let point: Point;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        spyOn(ctxStub, 'beginPath');
        spyOn(ctxStub, 'lineTo');
        spyOn(ctxStub, 'moveTo');

        width = 15;
        color = '#ffeedd';
        spray = new Spray(width, color);
    });

    it('should be created', () => {
        expect(spray).toBeTruthy();
    });

    it('draw should not draw on canvas when no points are added', () => {
        // Arrange

        // Act
        spray.draw(ctxStub);

        // Assert
        expect(ctxStub.lineTo).not.toHaveBeenCalled();
    });

    it('draw should erase the surface when one point is added', () => {
        // Arrange
        point = { x: 0, y: 0 };

        // Act
        spray.addPoint(point);
        spray.draw(ctxStub);

        // Assert
        expect(ctxStub.lineTo).toHaveBeenCalled();
    });
});
