import { TestBed } from '@angular/core/testing';
import { MouseData } from '@app/classes/interfaces/mousedata';
import { CanvasService, MIN_CANVAS_SIZE } from '@app/services/canvas/canvas.service';
import { ResizeService } from './resize.service';

// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal

describe('ResizeService', () => {
    let service: ResizeService;
    let canvasServiceSpy: jasmine.SpyObj<CanvasService>;

    beforeEach(() => {
        canvasServiceSpy = jasmine.createSpyObj('CanvasService', ['getOffsetLeft', 'storeImageData', 'setSize', 'restoreImageData']);
        canvasServiceSpy.getOffsetLeft.and.returnValue(10);

        TestBed.configureTestingModule({
            providers: [ResizeService, { provide: CanvasService, useValue: canvasServiceSpy }],
        });
        service = TestBed.inject(ResizeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#resize should emit size and restore canvas image', () => {
        // Arrange
        spyOn(service.size, 'next');
        spyOn(service['gridService'], 'drawGrid');

        // Act
        service.resize();

        // Assert
        expect(service.size.next).toHaveBeenCalled();
        expect(canvasServiceSpy.storeImageData).toHaveBeenCalled();
        expect(canvasServiceSpy.setSize).toHaveBeenCalled();
        expect(canvasServiceSpy.restoreImageData).toHaveBeenCalled();
        expect(service['gridService'].drawGrid).toHaveBeenCalled();
    });

    it('#updateWidthSize should set #width', () => {
        // Arrange
        const event = {
            mouseX: 300,
            mouseY: 300,
        } as MouseData;
        const expectedWidth = event.mouseX - canvasServiceSpy.getOffsetLeft();

        // Act
        service.updateWidthSize(event);

        // Assert
        expect(service.width).toBe(expectedWidth);
    });

    it('#updateHeightSize should set #height', () => {
        // Arrange
        const event = {
            mouseX: 500,
            mouseY: 500,
        } as MouseData;
        const expectedHeight = event.mouseY;

        // Act
        service.updateHeightSize(event);

        // Assert
        expect(service.height).toBe(expectedHeight);
    });

    it('#updateWidthSize should set #width to MIN_CANVAS_SIZE if resize too small', () => {
        // Arrange
        const event = {
            mouseX: 100,
            mouseY: 100,
        } as MouseData;

        // Act
        service.updateWidthSize(event);

        // Assert
        expect(service.width).toBe(MIN_CANVAS_SIZE);
    });

    it('#updateHeightSize should set #height to MIN_CANVAS_SIZE if resize too small', () => {
        // Arrange
        const event = {
            mouseX: 0,
            mouseY: 50,
        } as MouseData;

        // Act
        service.updateHeightSize(event);

        // Assert
        expect(service.height).toBe(MIN_CANVAS_SIZE);
    });
});
