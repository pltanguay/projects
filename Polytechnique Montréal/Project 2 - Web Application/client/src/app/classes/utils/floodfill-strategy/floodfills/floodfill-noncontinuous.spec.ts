import { Color } from '@app/classes/color/color';
import { FloodFillNonContinuousStrategy } from '@app/classes/utils/floodfill-strategy/floodfills/floodfill-noncontinuous';
import { IndexWithSurroundings } from '@app/classes/utils/floodfill-strategy/index-surroundings/index-surroundings';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
describe('FloodFillNonContinuousStrategy', () => {
    let floodfillNonContinuous: FloodFillNonContinuousStrategy;
    let tolerance: number;
    let fillColor: Color;
    let oldColor: Color;
    let imageData: ImageData;
    let mouseDownIndex: number;

    beforeEach(() => {
        imageData = new ImageData(25, 25);
        tolerance = 15;
        mouseDownIndex = 25;

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
        floodfillNonContinuous = new FloodFillNonContinuousStrategy(fillColor, oldColor, tolerance, mouseDownIndex);
        floodfillNonContinuous['imageData'] = imageData;
    });

    it('should be created', () => {
        expect(floodfillNonContinuous).toBeTruthy();
    });

    it('#do should call initTypedBuffer', () => {
        // Arrange
        const spyInitTypedBuffer = spyOn<any>(floodfillNonContinuous, 'initTypedBuffer');
        spyOn<any>(floodfillNonContinuous, 'processNeighbour');

        // Act
        floodfillNonContinuous.do(imageData);

        // Assert
        expect(spyInitTypedBuffer).toHaveBeenCalled();
    });

    it('#do should call processNeighour 4 times', () => {
        // Arrange
        spyOn<any>(floodfillNonContinuous, 'initTypedBuffer');
        const spyInitTypedBuffer = spyOn<any>(floodfillNonContinuous, 'processNeighbour');

        // Act
        floodfillNonContinuous.do(imageData);

        // Assert
        expect(spyInitTypedBuffer).toHaveBeenCalledTimes(4);
    });

    it('#processNeighbour should call #fillPoint if #isInsideCanvas and #hasPassedColorTest are true', () => {
        // Arrange
        floodfillNonContinuous['imageData'] = imageData;
        spyOn<any>(floodfillNonContinuous, 'isInsideCanvas').and.returnValue(true);
        spyOn<any>(floodfillNonContinuous, 'hasPassedColorTest').and.returnValue(true);
        spyOn<any>(floodfillNonContinuous, 'fillPoint');

        const surroundingsTest = new IndexWithSurroundings(mouseDownIndex, imageData.width);

        // Act
        floodfillNonContinuous['processNeighbour'](surroundingsTest);

        // Assert
        expect(floodfillNonContinuous['fillPoint']).toHaveBeenCalled();
    });

    it('#processNeighbour should not call #fillPoint if #isInsideCanvas is true and #hasPassedColorTest is false', () => {
        // Arrange
        floodfillNonContinuous['imageData'] = imageData;
        spyOn<any>(floodfillNonContinuous, 'isInsideCanvas').and.returnValue(true);
        spyOn<any>(floodfillNonContinuous, 'hasPassedColorTest').and.returnValue(false);
        spyOn<any>(floodfillNonContinuous, 'fillPoint');

        const surroundingsTest = new IndexWithSurroundings(mouseDownIndex, imageData.width);

        // Act
        floodfillNonContinuous['processNeighbour'](surroundingsTest);

        // Assert
        expect(floodfillNonContinuous['fillPoint']).not.toHaveBeenCalled();
    });
});
