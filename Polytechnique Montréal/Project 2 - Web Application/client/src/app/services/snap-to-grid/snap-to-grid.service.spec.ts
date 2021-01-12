import { TestBed } from '@angular/core/testing';
import { GridService } from '@app/services/tools/grid-service/grid.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SnapDirection, SnapToGridService } from './snap-to-grid.service';

// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('SnapToGridService', () => {
    let service: SnapToGridService;
    let gridService: jasmine.SpyObj<GridService>;
    let boundingBox: jasmine.SpyObj<BoundingBoxService>;

    beforeEach(() => {
        gridService = { ...jasmine.createSpyObj('GridService', ['']), squareSize: 20 };

        boundingBox = { ...jasmine.createSpyObj('BoundingBoxService', ['']), top: 0, left: 0, dimension: { width: 100, height: 200 } };
        TestBed.configureTestingModule({
            providers: [
                { provide: BoundingBoxService, useValue: boundingBox },
                { provide: GridService, useValue: gridService },
            ],
        });
        service = TestBed.inject(SnapToGridService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getNearestPointTranslation should return nearest tranlsation of bounding box', () => {
        // Arrange
        gridService.squareSize = 40;
        const boxTopLeft = { x: 240, y: 0 };
        const translate = { x: 25, y: 0 };
        const expectedTranslation = { x: 40, y: 0 };

        // Act
        const translation = service.getNearestPointTranslation(boxTopLeft, translate);

        // Assert
        expect(translation).toEqual(expectedTranslation);
    });

    it('#getArrowTranslationPoint should add square size if bounding box is already on grid point', () => {
        // Arrange
        const tranlsationDelta = { x: 3, y: 0 };
        const translate = { x: 0, y: 0 };
        const expectedTranslation = { x: gridService.squareSize, y: 0 };

        // Act
        const translation = service.getArrowTranslationPoint(tranlsationDelta, translate);

        // Assert
        expect(translation).toEqual(expectedTranslation);
    });

    it('#getArrowTranslationPoint should return current translation if bounding box not on grid point', () => {
        // Arrange
        const tranlsationDelta = { x: 3, y: 0 };
        const translate = { x: 3, y: 0 };
        const expectedTranslation = { x: 3, y: 0 };

        // Act
        const translation = service.getArrowTranslationPoint(tranlsationDelta, translate);

        // Assert
        expect(translation).toEqual(expectedTranslation);
    });

    it('#getArrowTranslationPoint should call isSameSign', () => {
        // Arrange
        spyOn<any>(service, 'isSameSign');
        const tranlsationDelta = { x: 3, y: 0 };
        const translate = { x: 3, y: 0 };

        // Act
        service.getArrowTranslationPoint(tranlsationDelta, translate);

        // Assert
        expect(service['isSameSign']).toHaveBeenCalled();
    });

    it('#toggle should toggle #active', () => {
        // Arrange
        service.active = false;

        // Act
        service.toggle();

        // Assert
        expect(service.active).toBeTrue();
    });

    it('#distance should return distance between two points', () => {
        // Arrange
        const a = { x: 1, y: 0 };
        const b = { x: 2, y: 0 };

        // Act
        const distance = service['distance'](a, b);

        // Assert
        expect(distance).toEqual(1);
    });

    it('#sameSign should return true if two numbers have same sign', () => {
        // Arrange
        const a = 10;
        const b = 20;

        // Act
        const same = service['isSameSign'](a, b);

        // Assert
        expect(same).toBeTrue();
    });

    it('#sameSign should return false if two numbers dont have same sign', () => {
        // Arrange
        const a = 10;
        const b = -20;

        // Act
        const same = service['isSameSign'](a, b);

        // Assert
        expect(same).toBeFalse();
    });

    it('#snapPoint should return bounding box point by direction', () => {
        for (const snapDir of Object.values(SnapDirection)) {
            // Arrange
            service.snapDirection = snapDir;

            // Act
            const ret = service.snapPoint;

            // Assert
            expect(ret).toEqual(boundingBox.topLeft);
        }
    });
});
