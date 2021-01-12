import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';
import { BaseTrace } from './base-trace';

class BaseTraceTest extends BaseTrace {}

// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
describe('BaseTrace', () => {
    let baseTrace: BaseTraceTest;
    let width: number;
    let color: string;
    let ctxStub: CanvasRenderingContext2D;
    let point: Point;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        width = 15;
        color = '#ffeedd';
        baseTrace = new BaseTraceTest(width, color);
        point = new Point(10, 10);
        baseTrace.path.add(point);
    });

    it('should be created', () => {
        expect(baseTrace).toBeTruthy();
    });

    it('#setContextAttribute should set context strokeStyle, lineJoin, lineCap, lineWidth', () => {
        // Arrange

        // Act
        baseTrace.setContextAttribute(ctxStub);

        // Assert
        expect(ctxStub.strokeStyle).toBe(baseTrace['color']);
        expect(ctxStub.lineJoin).toBe('round');
        expect(ctxStub.lineCap).toBe('round');
        expect(ctxStub.lineWidth).toBe(baseTrace['width']);
    });

    it('#processDrawing should call #setContextAttribute', () => {
        // Arrange
        spyOn(baseTrace, 'setContextAttribute');

        // Act
        baseTrace.processDrawing(ctxStub);

        // Assert
        expect(baseTrace.setContextAttribute).toHaveBeenCalled();
    });

    it('#processDrawing should loop through all paths and draw them', () => {
        // Arrange
        spyOn(ctxStub, 'beginPath');
        spyOn(ctxStub, 'lineTo');
        spyOn(ctxStub, 'stroke');

        // Act
        baseTrace.processDrawing(ctxStub);

        // Assert
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.lineTo).toHaveBeenCalled();
        expect(ctxStub.stroke).toHaveBeenCalled();
    });
});
