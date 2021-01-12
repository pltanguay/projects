import { Dimension } from '@app/classes/interfaces/dimension';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';
import { DashedRectangle } from './dashed-rectangle';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
describe('Rectangle', () => {
    let dashedRectangle: DashedRectangle;
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
        spyOn(ctxStub, 'setLineDash');

        dimension = { width: 10, height: 15, canContourFit: true };
        upperLeft = { x: 0, y: 0 };

        width = 0;
        fillColor = 'white';
        strokeColor = 'black';
        withBorder = true;
        withFill = false;
        dashedRectangle = new DashedRectangle(width, fillColor, strokeColor, withBorder, withFill);
        dashedRectangle.dimension = dimension;
        dashedRectangle.upperLeft = upperLeft;
    });

    it('should be created', () => {
        expect(dashedRectangle).toBeTruthy();
    });

    it('draw should set line dash of canvas', () => {
        dashedRectangle['withBorder'] = true;
        dashedRectangle['dimension'] = { width: 10, height: 15, canContourFit: false };

        dashedRectangle.draw(ctxStub);

        expect(ctxStub.setLineDash).toHaveBeenCalled();
    });
});
