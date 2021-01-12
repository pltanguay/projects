import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Matrix } from '@app/classes/matrix/matrix';
import { Point } from '@app/classes/utils/point';
import { BoundingBoxService } from './bounding-box.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-magic-numbers
describe('BoundingBoxService', () => {
    let service: BoundingBoxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BoundingBoxService);
        service.borderPoints = new Set<Vec2>();
        service.borderPoints.add({ x: 10, y: 5 });
        service.borderPoints.add({ x: 10, y: 5 });
        service.borderPoints.add({ x: 10, y: 5 });
        service.borderPoints.add({ x: 10, y: 5 });
        service.dimension = { width: 100, height: 100 };
        service.top = 10;
        service.left = 0;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#applyMatrixOnBorderPoints should call update dimensions', () => {
        // Arrange
        const m = new Matrix();
        spyOn<any>(service, 'updateDimension');

        // Act
        service.applyMatrixOnBorderPoints(m);

        // Assert
        expect(service['updateDimension']).toHaveBeenCalled();
    });

    it('#applyTranslation should set top and left', () => {
        // Arrange
        const translation = { x: 10, y: 10 };
        service.top = 0;
        service.left = 0;

        // Act
        service.applyTranslation(translation);

        // Assert
        expect(service.top).toEqual(10);
        expect(service.left).toEqual(10);
    });

    it('#updateDimension should call #applyTransformationOnPoint', () => {
        // Arrange
        const m = new Matrix();
        spyOn<any>(service, 'applyTransformationOnPoint').and.returnValue({ x: 19, y: 19 });

        // Act
        service['updateDimension'](m);

        // Assert
        expect(service['applyTransformationOnPoint']).toHaveBeenCalled();
    });

    it('#applyTransformationOnPoint should multiply point with matrix', () => {
        // Arrange
        const m = new Matrix();
        const p = { x: 5, y: 6 };

        // Act
        const ret = service['applyTransformationOnPoint'](p, m);

        // Assert
        expect(ret).toEqual({ x: 5, y: 6 });
    });

    it('#upperLeft should return upperLeft', () => {
        // Arrange
        const exp = new Point(service.left, service.top);

        // Act
        const ret = service.upperLeft;

        // Assert
        expect(ret).toEqual(exp);
    });

    it('#center should return center', () => {
        // Arrange
        const exp = new Point(service.left + service.dimension.width / 2, service.top + service.dimension.height / 2);

        // Act
        const ret = service.center;

        // Assert
        expect(ret).toEqual(exp);
    });

    it('#absDimension should return dimension in absolute', () => {
        // Arrange
        service.dimension = { width: -100, height: -100 };

        // Act
        const ret = service.absDimension;

        // Assert
        expect(ret).toEqual({ width: 100, height: 100 });
    });

    it('#topLeft should return topLeft', () => {
        // Arrange
        const exp = new Point(service.upperLeft.x, service.upperLeft.y);

        // Act
        const ret = service.topLeft;

        // Assert
        expect(ret).toEqual(exp);
    });

    it('#topLeft should return topLeft', () => {
        // Arrange
        service.top = 10;
        service.left = 10;
        const exp = new Point(service.left, service.top);

        // Act
        const ret = service.topLeft;

        // Assert
        expect(ret).toEqual(exp);
    });

    it('#topCenter should return topLeft', () => {
        // Arrange
        const exp = { x: service.center.x, y: service.center.y - service.absDimension.height / 2 };

        // Act
        const ret = service.topCenter;

        // Assert
        expect(ret).toEqual(exp);
    });

    it('#topRight should return topLeft', () => {
        // Arrange
        const exp = { x: service.upperLeft.x + service.absDimension.width, y: service.upperLeft.y };
        // Act
        const ret = service.topRight;

        // Assert
        expect(ret).toEqual(exp);
    });

    it('#centerLeft should return topLeft', () => {
        // Arrange
        const exp = { x: service.center.x - service.absDimension.width / 2, y: service.center.y };

        // Act
        const ret = service.centerLeft;

        // Assert
        expect(ret).toEqual(exp);
    });

    it('#centerRight should return topLeft', () => {
        // Arrange
        const exp = { x: service.center.x + service.absDimension.width / 2, y: service.center.y };

        // Act
        const ret = service.centerRight;

        // Assert
        expect(ret).toEqual(exp);
    });

    it('#bottomLeft should return topLeft', () => {
        // Arrange
        const exp = { x: service.center.x - service.absDimension.width / 2, y: service.center.y + service.absDimension.height / 2 };

        // Act
        const ret = service.bottomLeft;

        // Assert
        expect(ret).toEqual(exp);
    });

    it('#bottomCenter should return topLeft', () => {
        // Arrange
        const exp = { x: service.center.x, y: service.center.y + service.absDimension.height / 2 };

        // Act
        const ret = service.bottomCenter;

        // Assert
        expect(ret).toEqual(exp);
    });

    it('#bottomRight should return topLeft', () => {
        // Arrange
        const exp = { x: service.center.x + service.absDimension.width / 2, y: service.center.y + service.absDimension.height / 2 };

        // Act
        const ret = service.bottomRight;

        // Assert
        expect(ret).toEqual(exp);
    });
});
