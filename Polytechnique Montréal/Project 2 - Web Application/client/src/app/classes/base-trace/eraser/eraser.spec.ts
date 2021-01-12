import { Vec2 } from '@app/classes/interfaces/vec2';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { ERASER_DEFAULT_WIDTH } from '@app/services/tools/base-trace/eraser/eraser.service';
import { Eraser, ERASER_EXTRAPOLATION_RATIO } from './eraser';
describe('Eraser', () => {
    let eraser: Eraser;
    let width: number;
    let point: Vec2;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'beginPath');
        spyOn(ctxStub, 'fillRect');

        point = { x: 0, y: 0 };

        width = ERASER_DEFAULT_WIDTH;
        eraser = new Eraser(width);
    });

    it('should be created', () => {
        expect(eraser).toBeTruthy();
    });

    it('draw should not draw on canvas when no points are added', () => {
        // Arrange

        // Act
        eraser.draw(ctxStub);

        // Assert
        expect(ctxStub.fillRect).not.toHaveBeenCalled();
    });

    it('draw should erase the surface when one point is added', () => {
        // Arrange

        // Act
        eraser.addPoint(point);
        eraser.draw(ctxStub);

        // Assert
        expect(ctxStub.fillRect).toHaveBeenCalled();
    });

    it('draw should erase the last 2 surfaces when points are added (no extrapolation)', () => {
        // Arrange
        const distance = width / ERASER_EXTRAPOLATION_RATIO / 2;
        eraser.addPoint(point);
        eraser.addPoint({ x: distance / 2, y: distance / 2 });
        eraser.addPoint({ x: distance, y: distance });

        // Act
        eraser.draw(ctxStub);

        // Assert
        expect(ctxStub.fillRect).toHaveBeenCalledTimes(2);
    });

    it('draw should erase the correct number of surfaces with extrapolation when mouse positions are far', () => {
        // Arrange
        eraser.addPoint(point);
        eraser.addPoint({ x: width * 2, y: width * 2 });

        // Act
        eraser.draw(ctxStub);

        // Assert
        expect(ctxStub.fillRect).toHaveBeenCalled();
        expect(ctxStub.fillRect).not.toHaveBeenCalledTimes(2);
    });

    it('redraw with no path pushed and no current path should do nothing', () => {
        // Arrange

        // Act
        eraser.redraw(ctxStub);

        // Assert
        expect(ctxStub.fillRect).not.toHaveBeenCalled();
    });

    it('redraw with no path pushed should erase the correct number of surfaces when points are added', () => {
        // Arrange
        eraser.addPoint(point);

        // Act
        eraser.redraw(ctxStub);

        // Assert
        expect(ctxStub.fillRect).toHaveBeenCalled();
    });

    it('redraw with one pushed path should erase the correct number of surfaces when points are added', () => {
        // Arrange
        eraser.addPoint(point);

        // Act
        eraser.redraw(ctxStub);

        // Assert
        expect(ctxStub.fillRect).toHaveBeenCalled();
    });
});
