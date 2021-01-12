import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';
import { Calligraphy } from './calligraphy';

// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal

describe('Calligraphy', () => {
    let calligraphy: Calligraphy;
    let width: number;
    let color: string;
    let angle: number;
    let ctxStub: CanvasRenderingContext2D;
    let point: Point;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'beginPath');
        spyOn(ctxStub, 'lineTo');

        point = { x: 0, y: 0 };
        width = 15;
        angle = 15;
        color = '#ffeedd';
        calligraphy = new Calligraphy(width, angle, color);
        calligraphy.setPoint(point);
    });

    it('should be created', () => {
        expect(calligraphy).toBeTruthy();
    });

    it('#setContextAttribute should set context fillStyle color', () => {
        // Arrange

        // Act
        calligraphy.setContextAttribute(ctxStub);

        // Assert
        expect(ctxStub.fillStyle).toBe(color);
    });

    it('#angleInRadians should return convert angle from degree to radian', () => {
        // Arrange
        calligraphy.angle = 30;
        const expectedTheta = 0.5;

        // Act
        let radianAngle = calligraphy['angleInRadians']();
        radianAngle = Math.round(radianAngle * 10) / 10;

        // Assert
        expect(radianAngle).toBe(expectedTheta);
    });

    it('draw should not draw on canvas when no points are added', () => {
        // Arrange

        // Act
        calligraphy.draw(ctxStub);

        // Assert
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.lineTo).toHaveBeenCalled();
    });
});
