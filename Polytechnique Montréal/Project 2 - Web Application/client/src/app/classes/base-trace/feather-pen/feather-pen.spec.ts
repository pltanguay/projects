import { FeatherPen } from '@app/classes/base-trace/feather-pen/feather-pen';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';

// tslint:disable:no-magic-numbers
// tslint:disable:no-any
// tslint:disable:no-string-literal

describe('FeatherPen', () => {
    let pen: FeatherPen;
    let width: number;
    let color: string;
    let angle: number;
    let ctxStub: CanvasRenderingContext2D;
    let point: Point;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        point = { x: 0, y: 0 };
        width = 15;
        angle = 15;
        color = '#ffeedd';
        pen = new FeatherPen(width, angle, color);
    });

    it('should be created', () => {
        expect(pen).toBeTruthy();
    });

    it('#setContextAttribute should set context fillStyle color', () => {
        // Arrange
        spyOn<any>(pen, 'drawCalligraphy');

        // Act
        pen.setContextAttribute(ctxStub);

        // Assert
        expect(ctxStub.fillStyle).toBe(color);
    });

    it('draw should not draw on canvas when no points are added', () => {
        // Arrange
        spyOn<any>(pen, 'drawCalligraphy');

        // Act
        pen.draw(ctxStub);

        // Assert
        expect(pen['drawCalligraphy']).not.toHaveBeenCalled();
    });

    it('draw should draw calligraphy when point is added', () => {
        // Arrange
        spyOn<any>(pen, 'drawCalligraphy');

        // Act
        pen.addPoint(point);
        pen.draw(ctxStub);

        // Assert
        expect(pen['drawCalligraphy']).toHaveBeenCalled();
    });

    it('redraw with no path pushed and no current path should do nothing', () => {
        // Arrange
        spyOn<any>(pen, 'drawCalligraphy');

        // Act
        pen.redraw(ctxStub);

        // Assert
        expect(pen['drawCalligraphy']).not.toHaveBeenCalled();
    });

    it('redraw with pushed path should redraw the calligraphy when points are added', () => {
        // Arrange
        spyOn<any>(pen, 'drawCalligraphy');
        pen.addPoint(point);

        // Act
        pen.redraw(ctxStub);

        // Assert
        expect(pen['drawCalligraphy']).toHaveBeenCalled();
    });

    it('drawCalligraphy should process calligraphy drawing', () => {
        // Arrange
        const spy = spyOn<any>(pen['calligraphy'], 'processDrawing');

        // Act
        pen['drawCalligraphy'](point, ctxStub);

        // Assert
        expect(spy).toHaveBeenCalled();
    });
});
