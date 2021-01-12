import { BaseShape } from '@app/classes/base-shape/base-shape';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
class BaseShapeTest extends BaseShape {
    constructor(width: number, strokeColor: string) {
        super(width, strokeColor);
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
describe('BaseShape', () => {
    let baseShape: BaseShapeTest;
    let width: number;
    let strokeColor: string;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        width = 1;
        strokeColor = 'red';
        baseShape = new BaseShapeTest(width, strokeColor);
    });
    it('should be created', () => {
        expect(baseShape).toBeTruthy();
    });

    it('#processDrawing should call #setCanvasSettings', () => {
        // Arrange
        spyOn<any>(baseShape, 'setCanvasSettings');

        // Act
        baseShape['processDrawing'](ctxStub);

        // Assert
        expect(baseShape['setCanvasSettings']).toHaveBeenCalled();
    });

    it('#processDrawing should call #drawNormalShape', () => {
        // Arrange
        spyOn<any>(baseShape, 'drawNormalShape');

        // Act
        baseShape['processDrawing'](ctxStub);

        // Assert
        expect(baseShape['drawNormalShape']).toHaveBeenCalled();
    });

    it('#setCanvasSettings should set correct parameters of context', () => {
        // Arrange
        const expectedColor = '#ffeedd';
        baseShape.strokeColor = expectedColor;

        // Act
        baseShape['setCanvasSettings'](ctxStub);

        // Assert
        expect(ctxStub.lineWidth).toBe(width);
        expect(ctxStub.strokeStyle).toBe(expectedColor);
    });
});
