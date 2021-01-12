import { Bucket } from '@app/classes/bucket/bucket';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { FloodfillStrategy } from '@app/classes/utils/floodfill-strategy/floodfill';
import { Size } from '@app/services/workspace/workspace.service';

describe('Bucket', () => {
    let bucket: Bucket;
    let canvasSize: Size;
    let ctxStub: CanvasRenderingContext2D;
    let floodfillStrategy: jasmine.SpyObj<FloodfillStrategy>;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvasSize = {
            width: 100,
            height: 100,
        };
        floodfillStrategy = jasmine.createSpyObj('FloodfillStrategy', ['do']);
        bucket = new Bucket(canvasSize, floodfillStrategy);
    });

    it('should be created', () => {
        // Arrange

        // Act

        // Assert
        expect(bucket).toBeTruthy();
    });

    it('draw should put image in canvas using putImage', () => {
        // Arrange
        spyOn(ctxStub, 'putImageData');

        // Act
        bucket.draw(ctxStub);

        // Assert
        expect(ctxStub.putImageData).toHaveBeenCalled();
    });
});
