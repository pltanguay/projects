import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from './grid.service';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
describe('GridService', () => {
    let service: GridService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasServiceSpy: jasmine.SpyObj<CanvasService>;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase', 'pushData']);
        canvasServiceSpy = { ...jasmine.createSpyObj('CanvasService', ['cleanGrid']), gridCtx: ctxStub } as jasmine.SpyObj<CanvasService>;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: CanvasService, useValue: canvasServiceSpy },
            ],
        });
        service = TestBed.inject(GridService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' #stopDrawing should reset attributes', () => {
        // Arrange
        service.opacity = 0.3;
        service.isActive = true;
        service.opacity = 100;

        // Act
        service.stopDrawing();

        // Assert
        expect(service.opacity).toBe(0.65);
        expect(service.isActive).toBe(false);
        expect(service.squareSize).toBe(40);
    });

    it(' #drawGrid should only clean canvas if it is not active', () => {
        // Arrange
        service.isActive = false;
        spyOn(ctxStub, 'stroke');

        // Act
        service.drawGrid();

        // Assert
        expect(canvasServiceSpy.cleanGrid).toHaveBeenCalled();
        expect(ctxStub.stroke).not.toHaveBeenCalled();
    });

    it(' #drawGrid should only clean canvas if it is not active', () => {
        // Arrange
        service.isActive = true;
        spyOn(ctxStub, 'stroke');

        const spyCalculateArray = spyOn<any>(service, 'calculateArray').and.returnValue(new Array(5, 10, 15));
        // Act
        service.drawGrid();

        // Assert
        expect(canvasServiceSpy.cleanGrid).toHaveBeenCalled();
        expect(spyCalculateArray).toHaveBeenCalledTimes(2);
        expect(ctxStub.stroke).toHaveBeenCalled();
    });

    it(' #calculateArray should return an array with all the points in X or Y according to the width or height', () => {
        // Arrange

        // Act
        const result = service['calculateArray'](80);

        // Assert
        expect(result.length).toBe(3);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(40);
        expect(result[2]).toBe(80);
    });

    it(' #increaseSquareSize should increase of 5 the square size of the grid', () => {
        // Arrange

        // Act
        service.increaseSquareSize();

        // Assert
        expect(service.squareSize).toBe(45);
    });
    it(' #increaseSquareSize should set to max if it goes out of bound', () => {
        // Arrange
        service.squareSize = 297;

        // Act
        service.increaseSquareSize();

        // Assert
        expect(service.squareSize).toBe(300);
    });

    it(' #decreaseSquareSize should increase of 5 the square size of the grid', () => {
        // Arrange

        // Act
        service.decreaseSquareSize();

        // Assert
        expect(service.squareSize).toBe(35);
    });
    it(' #decreaseSquareSize should set to min if it goes out of bound', () => {
        // Arrange
        service.squareSize = 17;

        // Act
        service.decreaseSquareSize();

        // Assert
        expect(service.squareSize).toBe(15);
    });
});
