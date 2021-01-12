import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';
import { Polygone, Radius, TRIANGLE } from './polygone';
// tslint:disable:no-string-literal
// tslint:disable:no-any

const NEGATIVE = -1;
const PENTAGONE = 5;

describe('Polygone', () => {
    let polygone: Polygone;
    let width: number;
    let fillColor: string;
    let strokeColor: string;
    let withBorder: boolean;
    let withFill: boolean;

    let center: Point;
    let radius: Radius;
    let numberOfSides: number;
    let yAxisSign: number;

    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'beginPath');
        spyOn(ctxStub, 'stroke');
        spyOn(ctxStub, 'fill');
        spyOn(ctxStub, 'strokeRect');
        spyOn(ctxStub, 'setLineDash');
        spyOn(ctxStub, 'lineTo');

        center = { x: 0, y: 0 };
        radius = { r: 5, canContourFit: true };
        numberOfSides = TRIANGLE;
        yAxisSign = NEGATIVE;

        width = 0;
        fillColor = '#000000';
        strokeColor = '#ffffff';
        withBorder = false;
        withFill = false;
        polygone = new Polygone(width, strokeColor, fillColor, withBorder, withFill, numberOfSides);
        polygone.center = center;
        polygone.radius = radius;
        polygone.yAxisSign = yAxisSign;
    });
    it('should be created', () => {
        expect(polygone).toBeTruthy();
    });

    it('#canContourFit should return false when contour can not fit', () => {
        // Arrange
        polygone['withBorder'] = true;
        polygone['radius'] = { r: 2, canContourFit: false };

        // Act
        const result = polygone['canContourFit']();

        // Assert
        expect(result).toBe(false);
    });

    it('#canContourFit should return true when contour can fit', () => {
        // Arrange
        polygone['radius'] = { r: 2, canContourFit: true };

        // Act
        const result = polygone['canContourFit']();

        // Assert
        expect(result).toBe(true);
    });

    it('#drawFilledShape should draw fill canvas whith a polygone of stroke color fillstyle', () => {
        // Arrange
        // Act
        polygone['drawFilledShape'](ctxStub);

        // Assert
        expect(ctxStub.fillStyle).toBe(strokeColor);
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.lineTo).toHaveBeenCalledTimes(numberOfSides + 2);
        expect(ctxStub.fill).toHaveBeenCalled();
    });

    it('#drawNormalShape should draw on canvas when #dimension and #upperLeft are not null', () => {
        // Arrange

        // Act
        polygone['drawNormalShape'](ctxStub);

        // Assert
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.lineTo).toHaveBeenCalledTimes(numberOfSides + 2);
    });

    it('#tryDrawInnerFill should fill inner polygone when inner polygone Fill Dimension is enough (case not Triangle)', () => {
        // Arrange
        polygone['width'] = 0;
        polygone['numberOfSides'] = PENTAGONE;

        // Act
        polygone['tryDrawInnerFill'](ctxStub);

        // Assert
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.lineTo).toHaveBeenCalledTimes(PENTAGONE + 2);
        expect(ctxStub.fill).toHaveBeenCalled();
    });

    it('#tryDrawInnerFill should fill inner polygone when inner polygone Fill Dimension is enough (case Triangle)', () => {
        // Arrange
        polygone['width'] = 0;

        // Act
        polygone['tryDrawInnerFill'](ctxStub);

        // Assert
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.lineTo).toHaveBeenCalledTimes(numberOfSides + 2);
        expect(ctxStub.fill).toHaveBeenCalled();
    });

    it('#tryDrawInnerFill should not fill inner polygone when contour is more than the surface', () => {
        // Arrange
        polygone['width'] = 2 + 1;
        polygone['withBorder'] = true;
        polygone['radius'] = { r: 1 };

        // Act
        polygone['tryDrawInnerFill'](ctxStub);

        // Assert
        expect(ctxStub.beginPath).not.toHaveBeenCalled();
        expect(ctxStub.lineTo).not.toHaveBeenCalled();
        expect(ctxStub.fill).not.toHaveBeenCalled();
    });

    it('#calculateNextPoint should calculate the next line of the polygone according on the index of the Vertex', () => {
        // Arrange
        const indexVertex = 0;
        const rad = 2;

        // Act
        const result: Point = polygone['calculateNextPoint'](indexVertex, rad);

        // Assert
        expect(result).toEqual(new Point(0, -rad));
    });
});
