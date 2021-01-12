import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color/color';
import { FloodFillNonContinuousStrategy } from '@app/classes/utils/floodfill-strategy/floodfills/floodfill-noncontinuous';
import { MagicWandAlgorithmService, Pixel } from './magic-wand-algorithm.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('MagicWandAlgorithmService', () => {
    let service: MagicWandAlgorithmService;
    let floodFill: jasmine.SpyObj<FloodFillNonContinuousStrategy>;

    beforeEach(() => {
        floodFill = jasmine.createSpyObj('FloodFillNonContinuousStrategy', ['do']);
        TestBed.configureTestingModule({});
        service = TestBed.inject(MagicWandAlgorithmService);
        service['floodFillStrategy'] = floodFill;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseLeft should execute flood fill along with marching squares algorithm', () => {
        // Arrange
        const color = 0xffffff;
        const oldColor = { uint32: color } as Color;
        const size = 10;
        const array = new Uint32Array(size * size);
        array[0] = color;
        array[size + 1] = color;
        for (let width = size; width <= 2 * size; width += size) {
            array.fill(color, width + 2, width + size - 2);
        }
        const imageData = new ImageData(new Uint8ClampedArray(array.buffer), size, size);
        floodFill.do.and.returnValue(imageData);

        // Act
        const result = service.onMouseLeft(imageData, oldColor, 0);

        // Assert
        expect(result.boxBorders.left).toBe(1);
        expect(result.boxBorders.right).toBe(size - 2 - 1);
        expect(result.boxBorders.top).toBe(2);
        expect(result.boxBorders.bottom).toBe(2 + 1);
    });

    it('#onMouseRight should execute only marching squares algorithm', () => {
        // Arrange
        const oldColor = { uint32: 0 } as Color;
        const imageData = {} as ImageData;
        const spy = spyOn(service, 'marchingSquaresAlgorithm' as any);

        // Act
        service.onMouseRight(imageData, oldColor);

        // Assert
        expect(spy).toHaveBeenCalled();
    });

    it('#onePointActive should call #addPointsToPath', () => {
        // Arrange
        const point = { x: 0, y: 2 } as Pixel;
        const x = 1;
        const y = 1;
        const spy = spyOn(service, 'addPointsToPath' as any);

        // Act
        service['onePointActive'](point, x, y);

        // Assert
        expect(spy).toHaveBeenCalled();
    });
});
