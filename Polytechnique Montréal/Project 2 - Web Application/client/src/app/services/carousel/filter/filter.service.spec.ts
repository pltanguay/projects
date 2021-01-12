import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { DrawingData } from '@common/communication/drawing-data';
import { FilterService } from './filter.service';
// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('FilterService', () => {
    let service: FilterService;
    let carouselService: CarouselService;
    let drawing: DrawingData;
    beforeEach(() => {
        drawing = {
            drawingName: 'drawing',
            tags: ['tag1', 'tag2', 'tag3'],
        };

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        carouselService = TestBed.inject(CarouselService);
        service = new FilterService(carouselService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#applyFilter should remove omitted elements from drawings', () => {
        // Arrange
        const omittedDrawing: DrawingData = {
            drawingName: 'drawing2',
            tags: ['tag3'],
        };
        carouselService['ringBuffer'].add([drawing, omittedDrawing]);

        // Act
        service.applyFilter('tag1');

        // Assert
        expect(service['unfilteredImages'].get(0)).toBe(omittedDrawing);
    });

    it('#applyFilter should return when filter cannot be applied', () => {
        // Arrange
        carouselService['ringBuffer'].add([drawing]);

        // Act
        service.applyFilter('NOTFOUND');

        // Assert
        expect(service.filters.length).toBe(0);
    });

    it('#applyFilter should return when filter cannot be applied (first filtering already done)', () => {
        // Arrange
        service.filters.push('tag');

        // Act
        service.applyFilter('tag1');

        // Assert
        expect(carouselService.drawingsLength).toBe(0);
    });

    it('#applyFilter should add elements to drawings when filter can be applied (first filtering already done)', () => {
        // Arrange
        service.filters.push('tag');
        service['unfilteredImages'].add([drawing]);

        // Act
        service.applyFilter('tag1');

        // Assert
        expect(carouselService.drawings.get(0)).toBe(drawing);
        expect(service.filters).toContain('tag1');
    });

    it('#unapplyFilter should restore filter state when last filter is unapplied', () => {
        // Arrange
        service.filters.push('tag1');
        service['unfilteredImages'].add([drawing]);

        // Act
        service.unapplyFilter(0);

        // Assert
        expect(carouselService.drawings.get(0)).toBe(drawing);
        expect(service.filters.length).toEqual(0);
    });

    it('#unapplyFilter should not add to unfiltered drawings when there is no omitted values', () => {
        // Arrange
        service.filters.push('tag1', 'tag2');

        // Act
        service.unapplyFilter(0);

        // Assert
        expect(service['unfilteredImages'].size).toEqual(0);
    });

    it('#unapplyFilter should unfilter correct drawings', () => {
        // Arrange
        service.filters.push('tag1', 'tag2');
        const drawing1: DrawingData = {
            drawingName: 'drawing2',
            tags: ['tag1'],
        };
        const drawing2: DrawingData = {
            drawingName: 'drawing2',
            tags: ['tag3'],
        };
        carouselService['ringBuffer'].add([drawing, drawing1, drawing2]);

        // Act
        service.unapplyFilter(0);

        // Assert
        expect(service['unfilteredImages'].get(0 - 1)).toBe(drawing1);
        expect(carouselService.drawingsLength).toBe(2);
    });

    it('#tryUpdateFilters should remove correct filters for clickedDrawing ', () => {
        // Arrange
        service.filters.push('tag1', 'tag2');
        const drawing1: DrawingData = {
            drawingName: 'drawing2',
            tags: ['tag1'],
        };
        const drawing2: DrawingData = {
            drawingName: 'drawing2',
            tags: ['tag3'],
        };
        carouselService['ringBuffer'].add([drawing1, drawing2]);

        // Act
        service.tryUpdateFilters(drawing);

        // Assert
        expect(service.filters.length).toBe(1);
        expect(service.filters[0]).toBe('tag1');
    });

    it('#reset should reset filter state', () => {
        // Arrange
        service.filters.push('tag');

        // Act
        service.reset();

        // Assert
        expect(service.filters.length).toBe(0);
    });
});
