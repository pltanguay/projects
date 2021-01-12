import { Dimension } from '@app/classes/interfaces/dimension';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';
import { Rectangle } from './rectangle';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
describe('Rectangle', () => {
    let rectangle: Rectangle;
    let width: number;
    let fillColor: string;
    let strokeColor: string;
    let withBorder: boolean;
    let withFill: boolean;
    let dimension: Dimension;
    let upperLeft: Point;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'beginPath');
        spyOn(ctxStub, 'rect');
        spyOn(ctxStub, 'stroke');
        spyOn(ctxStub, 'fill');
        spyOn(ctxStub, 'strokeRect');

        dimension = { width: 2, height: 2 };
        upperLeft = { x: 0, y: 0 };

        width = 0;
        fillColor = '#000000';
        strokeColor = '#ffffff';
        withBorder = false;
        withFill = false;
        rectangle = new Rectangle(width, strokeColor, fillColor, withBorder, withFill);
        rectangle.dimension = dimension;
        rectangle.upperLeft = upperLeft;
    });
    it('should be created', () => {
        expect(rectangle).toBeTruthy();
    });

    it('#canContourFit should return false when contour can not fit', () => {
        // Arrange
        rectangle['withBorder'] = true;
        rectangle['dimension'] = { width: 2, height: 2, canContourFit: false };

        // Act
        const result = rectangle['canContourFit']();

        // Assert
        expect(result).toBe(false);
    });

    it('#canContourFit should return true when contour can fit', () => {
        // Arrange
        rectangle['dimension'] = { width: 2, height: 2, canContourFit: true };

        // Act
        const result = rectangle['canContourFit']();

        // Assert
        expect(result).toBe(true);
    });

    it('#drawFilledShape should draw fill canvas whith a rectangle of stroke color fillstyle', () => {
        // Arrange

        // Act
        rectangle['drawFilledShape'](ctxStub);

        // Assert
        expect(ctxStub.fillStyle).toBe(strokeColor);
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.rect).toHaveBeenCalledWith(upperLeft.x, upperLeft.y, dimension.width, dimension.height);
        expect(ctxStub.fill).toHaveBeenCalled();
    });

    it('#drawNormalShape should draw on canvas when #dimension and #upperLeft are not null', () => {
        // Arrange

        // Act
        rectangle['drawNormalShape'](ctxStub);

        // Assert
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.strokeRect).toHaveBeenCalledWith(upperLeft.x, upperLeft.y, dimension.width, dimension.height);
    });

    it('#tryDrawInnerFill should fill inner rectangle when inner Rectangle Fill Dimension is enough', () => {
        // Arrange
        rectangle['width'] = 0;

        // Act
        rectangle['tryDrawInnerFill'](ctxStub);

        // Assert
        expect(ctxStub.rect).toHaveBeenCalledWith(upperLeft.x, upperLeft.y, dimension.width, dimension.height);
        expect(ctxStub.fill).toHaveBeenCalled();
    });

    it('#tryDrawInnerFill should not fill inner rectangle when contour is more than inner rect', () => {
        // Arrange
        rectangle['width'] = 2 + 1;
        rectangle['dimension'] = { width: 2, height: 2 };

        // Act
        rectangle['tryDrawInnerFill'](ctxStub);

        // Assert
        expect(ctxStub.rect).not.toHaveBeenCalled();
        expect(ctxStub.fill).not.toHaveBeenCalled();
    });
});
