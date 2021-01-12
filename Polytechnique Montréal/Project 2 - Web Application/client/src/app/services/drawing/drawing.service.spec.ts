import { TestBed } from '@angular/core/testing';
import { DrawableObject } from '@app/classes/drawable/drawable';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { DrawingService } from './drawing.service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
class DrawableStub extends DrawableObject {
    protected processDrawing(ctx: CanvasRenderingContext2D): void {
        return;
    }
}

describe('DrawingService', () => {
    let service: DrawingService;
    let drawableStub: DrawableObject;
    let canvasService: jasmine.SpyObj<CanvasService>;

    beforeEach(() => {
        canvasService = { ...jasmine.createSpyObj('CanvasService', ['cleanPreview', 'clean', 'cleanGrid']), width: 1, height: 1 };
        canvasService.canvas = canvasTestHelper.canvas;
        canvasService.context = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvasService.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        TestBed.configureTestingModule({
            providers: [{ provide: CanvasService, useValue: canvasService }],
        });
        service = TestBed.inject(DrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#drawBase should call drawable draw', () => {
        // Arrange
        drawableStub = new DrawableStub();
        spyOn(drawableStub, 'draw');

        // Act
        service.drawBase(drawableStub);

        // Assert
        expect(drawableStub.draw).toHaveBeenCalled();
        expect(drawableStub.draw).toHaveBeenCalledWith(service.baseCtx);
    });

    it('#reDrawBase should call drawable redraw', () => {
        // Arrange
        drawableStub = new DrawableStub();
        spyOn(drawableStub, 'redraw');

        // Act
        service.reDrawBase(drawableStub);

        // Assert
        expect(drawableStub.redraw).toHaveBeenCalledWith(service.baseCtx);
    });

    it('#drawPreview should call drawable drawPreview', () => {
        // Arrange
        drawableStub = new DrawableStub();
        spyOn(drawableStub, 'drawPreview');

        // Act
        service.drawPreview(drawableStub);

        // Assert
        expect(drawableStub.drawPreview).toHaveBeenCalled();
        expect(drawableStub.drawPreview).toHaveBeenCalledWith(canvasService.previewCtx);
    });

    it('#cleanPreview should call #cleanPreview on the canvas service', () => {
        // Arrange

        // Act
        service.cleanPreview();

        // Assert
        expect(canvasService.cleanPreview).toHaveBeenCalled();
    });
    it('#cleanGrid should call #cleanGrid on the canvas service', () => {
        // Arrange

        // Act
        service.cleanGrid();

        // Assert
        expect(canvasService.cleanGrid).toHaveBeenCalled();
    });

    it('#cleanBase should call #clean on the canvas service', () => {
        // Arrange

        // Act
        service.cleanBase();

        // Assert
        expect(canvasService.clean).toHaveBeenCalled();
    });

    it('#cleanBase should call #clean on the canvas service', () => {
        // Arrange

        // Act
        service.cleanBase();

        // Assert
        expect(canvasService.clean).toHaveBeenCalled();
    });

    it('#canvasWidth should return the width of canvas service', () => {
        // Arrange

        // Act
        const width = service.canvasWidth;

        // Assert
        expect(width).toEqual(canvasService.width);
    });

    it('#canvasHeight should return the heigth of canvas service', () => {
        // Arrange

        // Act
        const height = service.canvasHeight;

        // Assert
        expect(height).toEqual(canvasService.height);
    });

    it('#previewCtx should return the previewCtx of canvas service', () => {
        // Arrange

        // Act
        const previewCtx = service.previewCtx;

        // Assert
        expect(previewCtx).toEqual(canvasService.previewCtx);
    });

    it('#gridCtx should return the gridCtx of canvas service', () => {
        // Arrange

        // Act
        const gridCtx = service.gridCtx;

        // Assert
        expect(gridCtx).toEqual(canvasService.gridCtx);
    });
});
