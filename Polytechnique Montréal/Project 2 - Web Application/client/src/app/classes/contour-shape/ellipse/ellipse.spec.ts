import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';
import { Ellipse, Radius } from './ellipse';
// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('Ellipse', () => {
    let ellipse: Ellipse;
    let width: number;
    let fillColor: string;
    let strokeColor: string;
    let withBorder: boolean;
    let withFill: boolean;
    let radius: Radius;
    let center: Point;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'beginPath');
        spyOn(ctxStub, 'ellipse');
        spyOn(ctxStub, 'stroke');
        spyOn(ctxStub, 'fill');
        spyOn(ctxStub, 'strokeRect');
        spyOn(ctxStub, 'setLineDash');

        center = { x: 0, y: 0 };
        radius = { rx: 5, ry: 5, canContourFit: true };

        width = 0;
        fillColor = '#000000';
        strokeColor = '#ffffff';
        withBorder = false;
        withFill = false;
        ellipse = new Ellipse(width, strokeColor, fillColor, withBorder, withFill);
        ellipse.center = center;
        ellipse.radius = radius;
    });
    it('should be created', () => {
        expect(ellipse).toBeTruthy();
    });

    it('#canContourFit should return false when contour can not fit', () => {
        // Arrange
        ellipse['withBorder'] = true;
        ellipse['radius'] = { rx: 2, ry: 2, canContourFit: false };

        // Act
        const result = ellipse['canContourFit']();

        // Assert
        expect(result).toBe(false);
    });

    it('#canContourFit should return true when contour can fit', () => {
        // Arrange
        ellipse['radius'] = { rx: 2, ry: 2, canContourFit: true };

        // Act
        const result = ellipse['canContourFit']();

        // Assert
        expect(result).toBe(true);
    });

    it('#drawFilledShape should draw fill canvas whith a ellipse of stroke color fillstyle', () => {
        // Arrange

        // Act
        ellipse['drawFilledShape'](ctxStub);

        // Assert
        expect(ctxStub.fillStyle).toBe(strokeColor);
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.ellipse).toHaveBeenCalledWith(center.x, center.y, radius.rx, radius.ry, 0, 0, 2 * Math.PI);
        expect(ctxStub.fill).toHaveBeenCalled();
    });

    it('#drawNormalShape should draw on canvas when #dimension and #upperLeft are not null', () => {
        // Arrange

        // Act
        ellipse['drawNormalShape'](ctxStub);

        // Assert
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.ellipse).toHaveBeenCalledWith(center.x, center.y, radius.rx, radius.ry, 0, 0, 2 * Math.PI);
    });

    it('#tryDrawInnerFill should fill inner ellipse when inner ellipse Fill Dimension is enough', () => {
        // Arrange
        ellipse['width'] = 0;

        // Act
        ellipse['tryDrawInnerFill'](ctxStub);

        // Assert
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.ellipse).toHaveBeenCalledWith(center.x, center.y, radius.rx, radius.ry, 0, 0, 2 * Math.PI);
        expect(ctxStub.fill).toHaveBeenCalled();
    });

    it('#tryDrawInnerFill should not fill inner ellipse when contour is more than the surface', () => {
        // Arrange
        ellipse['width'] = 2 + 1;
        ellipse['withBorder'] = true;
        ellipse['radius'] = { rx: 1, ry: 1 };

        // Act
        ellipse['tryDrawInnerFill'](ctxStub);

        // Assert
        expect(ctxStub.beginPath).not.toHaveBeenCalled();
        expect(ctxStub.ellipse).not.toHaveBeenCalled();
        expect(ctxStub.fill).not.toHaveBeenCalled();
    });
});
