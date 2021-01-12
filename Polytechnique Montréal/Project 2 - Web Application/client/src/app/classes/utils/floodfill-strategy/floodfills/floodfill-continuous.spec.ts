import { Color } from '@app/classes/color/color';
import { FloodFillContinuousStrategy } from '@app/classes/utils/floodfill-strategy/floodfills/floodfill-continuous';

// tslint:disable:no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable:no-any
describe('FloodFillContinuousStrategy', () => {
    let floodfillContinuous: FloodFillContinuousStrategy;
    let tolerance: number;
    let fillColor: Color;
    let oldColor: Color;
    let imageData: ImageData;

    beforeEach(() => {
        imageData = new ImageData(25, 25);

        tolerance = 15;
        fillColor = new Color({
            red: '00',
            green: '00',
            blue: '00',
            opacity: 1,
        });

        oldColor = new Color({
            red: 'FF',
            green: 'FF',
            blue: 'FF',
            opacity: 1,
        });
        floodfillContinuous = new FloodFillContinuousStrategy(fillColor, oldColor, tolerance);
    });

    it('should be created', () => {
        expect(floodfillContinuous).toBeTruthy();
    });

    it('#do should call initTypedBuffer and #fillPoint if hasPassedColorTest is true', () => {
        // Arrange
        floodfillContinuous['imageData'] = imageData;
        const spyInitTypedBuffer = spyOn<any>(floodfillContinuous, 'initTypedBuffer');
        spyOn<any>(floodfillContinuous, 'hasPassedColorTest').and.returnValue(true);
        const spyFillPoint = spyOn<any>(floodfillContinuous, 'fillPoint');

        // Act
        floodfillContinuous.do(imageData);

        // Assert
        expect(spyInitTypedBuffer).toHaveBeenCalled();
        expect(spyFillPoint).toHaveBeenCalled();
    });

    it('#do should call initTypedBuffer and not #fillPoint if hasPassedColorTest is false', () => {
        // Arrange
        floodfillContinuous['imageData'] = imageData;
        const spyInitTypedBuffer = spyOn<any>(floodfillContinuous, 'initTypedBuffer');
        spyOn<any>(floodfillContinuous, 'hasPassedColorTest').and.returnValue(false);
        const spyFillPoint = spyOn<any>(floodfillContinuous, 'fillPoint');

        // Act
        floodfillContinuous.do(imageData);

        // Assert
        expect(spyInitTypedBuffer).toHaveBeenCalled();
        expect(spyFillPoint).not.toHaveBeenCalled();
    });
});
