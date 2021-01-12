import { DEFAULT_TOOL_WIDTH } from '@app/classes/tool/tool';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { ContourShape } from './contour-shape';

class ContourShapeTest extends ContourShape {
    constructor(width: number, fillColor: string, strokeColor: string, withBorder: boolean, withFill: boolean) {
        super(width, fillColor, strokeColor, withBorder, withFill);
    }

    canContourFit(): boolean {
        return false;
    }

    drawFilledShape(ctx: CanvasRenderingContext2D): void {
        return;
    }

    drawNormalShape(ctx: CanvasRenderingContext2D): void {
        return;
    }

    tryDrawInnerFill(ctx: CanvasRenderingContext2D): void {
        return;
    }
}

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('ContourShape', () => {
    let contourShape: ContourShapeTest;
    let width: number;
    let fillColor: string;
    let strokeColor: string;
    let withBorder: boolean;
    let withFill: boolean;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        width = 0;
        fillColor = '#000000';
        strokeColor = '#ffffff';
        withBorder = false;
        withFill = false;
        contourShape = new ContourShapeTest(width, strokeColor, fillColor, withBorder, withFill);
    });
    it('should be created', () => {
        expect(contourShape).toBeTruthy();
    });

    it('#processDrawing should #drawFilledShape when contour can not fit', () => {
        // Arrange
        spyOn<any>(contourShape, 'canContourFit').and.returnValue(false);
        spyOn<any>(contourShape, 'drawFilledShape');

        // Act
        contourShape['processDrawing'](ctxStub);

        // Assert
        expect(contourShape['drawFilledShape']).toHaveBeenCalled();
    });

    it('#processDrawing should not #drawFilledShape when contour can fit', () => {
        // Arrange
        spyOn<any>(contourShape, 'canContourFit').and.returnValue(true);
        spyOn<any>(contourShape, 'drawFilledShape');
        spyOn<any>(contourShape, 'drawNormalShape');
        // Act
        contourShape['processDrawing'](ctxStub);

        // Assert
        expect(contourShape['drawFilledShape']).not.toHaveBeenCalled();
        expect(contourShape['drawNormalShape']).toHaveBeenCalled();
    });

    it('#processDrawing should #tryDrawInnerFill when the withFill property is true and contour can be drawn', () => {
        // Arrange
        spyOn<any>(contourShape, 'canContourFit').and.returnValue(true);
        contourShape['withFill'] = true;
        spyOn<any>(contourShape, 'tryDrawInnerFill');

        // Act
        contourShape['processDrawing'](ctxStub);

        // Assert
        expect(contourShape['tryDrawInnerFill']).toHaveBeenCalled();
    });

    it('#setCanvasSettings should set correct parameters of context when the withBorder is true', () => {
        // Arrange
        const expectedWidth = 2;
        contourShape['withBorder'] = true;
        contourShape['width'] = expectedWidth;

        // Act
        contourShape['setCanvasSettings'](ctxStub);

        // Assert
        expect(ctxStub.lineWidth).toBe(expectedWidth);
        expect(ctxStub.strokeStyle).toBe(strokeColor);
        expect(ctxStub.fillStyle).toBe(fillColor);
    });

    it('#setCanvasSettings should set correct parameters of context when the withBorder is false', () => {
        // Arrange
        const expectedWidth = 2;
        contourShape['withBorder'] = false;
        contourShape['width'] = expectedWidth;

        // Act
        contourShape['setCanvasSettings'](ctxStub);

        // Assert
        expect(ctxStub.lineWidth).toBe(DEFAULT_TOOL_WIDTH);
        expect(ctxStub.strokeStyle).toBe(fillColor);
        expect(ctxStub.fillStyle).toBe(fillColor);
    });
});
