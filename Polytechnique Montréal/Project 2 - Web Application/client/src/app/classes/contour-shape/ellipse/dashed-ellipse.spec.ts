import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';
import { DashedEllipse } from './dashed-ellipse';
import { Radius } from './ellipse';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
describe('DashedEllipse', () => {
    let dashedEllipse: DashedEllipse;
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
        spyOn(ctxStub, 'setLineDash');

        radius = { rx: 10, ry: 15 };
        center = { x: 0, y: 0 };

        width = 0;
        fillColor = 'white';
        strokeColor = 'black';
        withBorder = true;
        withFill = false;
        dashedEllipse = new DashedEllipse(width, fillColor, strokeColor, withBorder, withFill);
        dashedEllipse.radius = radius;
        dashedEllipse.center = center;
    });

    it('should be created', () => {
        expect(dashedEllipse).toBeTruthy();
    });

    it('#drawNormalShape should draw a dashed ellipse', () => {
        // Act
        dashedEllipse['drawNormalShape'](ctxStub);

        // Assert
        expect(ctxStub.setLineDash).toHaveBeenCalled();
        expect(ctxStub.beginPath).toHaveBeenCalled();
        expect(ctxStub.ellipse).toHaveBeenCalled();
        expect(ctxStub.stroke).toHaveBeenCalled();
    });
});
