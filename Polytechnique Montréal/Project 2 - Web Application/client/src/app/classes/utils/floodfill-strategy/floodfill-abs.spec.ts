import { Color } from '@app/classes/color/color';
import { Floodfill } from '@app/classes/utils/floodfill-strategy/floodfill-abs';

class FloodfillTest extends Floodfill {
    constructor(fillColor: Color, oldColor: Color, tolerance: number) {
        super(fillColor, oldColor, tolerance);
    }
}

// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('Floodfill', () => {
    let floodfill: FloodfillTest;
    let tolerance: number;
    let fillColor: Color;
    let oldColor: Color;
    let imageData: ImageData;
    let indexPoint: number;

    beforeEach(() => {
        tolerance = 15;
        imageData = new ImageData(25, 25);

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

        floodfill = new FloodfillTest(fillColor, oldColor, tolerance);
        floodfill['viewArrayUint32'] = new Uint32Array(imageData.data.buffer);
        floodfill['fillColor'] = fillColor;
        floodfill['oldColor'] = oldColor;
        indexPoint = 25;
    });

    it('should be created', () => {
        expect(floodfill).toBeTruthy();
    });

    it('#initTypedBuffer should populate #viewArrayUint32', () => {
        // Arrange
        const viewArrayUint32 = new Uint32Array(imageData.data.buffer);

        // Act
        floodfill['initTypedBuffer'](imageData);

        // Assert
        expect(floodfill['imageData']).toBe(imageData);
        expect(floodfill['viewArrayUint32']).toEqual(viewArrayUint32);
    });

    it('#fillPoint should put a uint32 color in #viewArrayUint32', () => {
        // Arrange

        // Act
        floodfill['fillPoint'](indexPoint);

        // Assert
        expect(floodfill['viewArrayUint32'][25]).toBe(fillColor.uint32);
    });

    it('#hasPassedColorTest should return true when #neighbour color equal the old color', () => {
        // Arrange
        floodfill['viewArrayUint32'][indexPoint] = oldColor.uint32;

        // Act
        const hasPassed = floodfill['hasPassedColorTest'](indexPoint);

        // Assert
        expect(hasPassed).toEqual(true);
    });

    it('#hasPassedColorTest should return false when #neighbour color equal the fill color', () => {
        // Arrange
        floodfill['viewArrayUint32'][indexPoint] = fillColor.uint32;

        // Act
        const hasPassed = floodfill['hasPassedColorTest'](indexPoint);

        // Assert
        expect(hasPassed).toBe(false);
    });

    it('#hasPassedColorTest should call #hasPassedTest if neighbour color is not #oldColor and #fillColor', () => {
        // Arrange
        const testColor = new Color({
            red: '01',
            green: '01',
            blue: '01',
            opacity: 1,
        });

        floodfill['viewArrayUint32'][indexPoint] = testColor.uint32;
        const spy = spyOn<any>(floodfill, 'hasPassedToleranceTest').and.returnValue(true);

        // Act
        floodfill['hasPassedColorTest'](indexPoint);

        // Assert
        expect(spy).toHaveBeenCalledWith(indexPoint);
    });

    it('#isInsideCanvas should return true if #index is between 0 and #viewArrayUint32 length', () => {
        // Arrange

        // Act
        const hasPassed = floodfill['isInsideCanvas'](indexPoint);

        // Assert
        expect(hasPassed).toBe(true);
    });

    it('#isInsideCanvas should return false if #index is under 0', () => {
        // Arrange
        indexPoint = -4;

        // Act
        const hasPassed = floodfill['isInsideCanvas'](indexPoint);

        // Assert
        expect(hasPassed).toBe(false);
    });

    it('#isInsideCanvas should return false if #index is over length', () => {
        // Arrange
        indexPoint = 1000;

        // Act
        const hasPassed = floodfill['isInsideCanvas'](indexPoint);

        // Assert
        expect(hasPassed).toBe(false);
    });

    it('#hasPassedToleranceTest should return true if #averageDifference is less than #tolerance', () => {
        // Arrange
        floodfill['tolerance'] = 20;
        floodfill['imageData'] = imageData;

        const colorBelowTolerance20 = new Color({
            red: 'FF',
            green: 'FF',
            blue: 'FE',
            opacity: 1,
        });

        floodfill['viewArrayUint32'][indexPoint] = colorBelowTolerance20.uint32;

        // Act
        const hasPassed = floodfill['hasPassedToleranceTest'](indexPoint);

        // Assert
        expect(hasPassed).toBe(true);
    });

    it('#hasPassedToleranceTest should return false if #averageDifference is more than #tolerance', () => {
        // Arrange
        floodfill['tolerance'] = 20;
        floodfill['imageData'] = imageData;

        const colorAboveTolerance20 = new Color({
            red: '01',
            green: '01',
            blue: '01',
            opacity: 1,
        });

        floodfill['viewArrayUint32'][indexPoint] = colorAboveTolerance20.uint32;

        // Act
        const hasPassed = floodfill['hasPassedToleranceTest'](indexPoint);

        // Assert
        expect(hasPassed).toBe(false);
    });
});
