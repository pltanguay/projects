import { Brush, FILTER_NONE, SHADOW_0, SHADOW_20 } from '@app/classes/base-trace/brush/brush';
import { DEFAULT_TOOL_WIDTH } from '@app/classes/tool/tool';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';

// tslint:disable:no-string-literal
describe('Brush', () => {
    let brush: Brush;
    let ctxStub: CanvasRenderingContext2D;

    let strokeWidth: number;
    let color: string;
    let filter: string;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        strokeWidth = DEFAULT_TOOL_WIDTH;
        filter = FILTER_NONE;
        color = 'white';
        brush = new Brush(strokeWidth, color, filter);
    });

    it(' should be created', () => {
        expect(brush).toBeTruthy();
    });

    it(' #setContextAttribute should property #shadowBlur to 20 with property #filter Shadow', () => {
        // Arrange
        brush['filter'] = 'none';

        // Act
        brush.setContextAttribute(ctxStub);

        // Assert
        expect(ctxStub.shadowBlur).toEqual(SHADOW_20);
    });

    it(' #setContextAttribute should property #shadowBlur to 0 with #filter property Black Shadow', () => {
        // Arrange
        brush['filter'] = 'url(#blackShadow)';

        // Act
        brush.setContextAttribute(ctxStub);

        // Assert
        expect(ctxStub.shadowBlur).toEqual(SHADOW_0);
    });
});
