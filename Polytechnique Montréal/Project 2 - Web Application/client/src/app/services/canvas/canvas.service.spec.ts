import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanvasService } from './canvas.service';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable: no-any
describe('CanvasService', () => {
    let service: CanvasService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CanvasService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#setCanvas should update the #canvas element', () => {
        // Arrange
        const canvasStub = document.createElement('canvas');
        const canvasEle: ElementRef<HTMLCanvasElement> = new ElementRef<HTMLCanvasElement>(canvasStub);

        // Act
        service.setCanvas(canvasEle);

        // Assert
        expect(service.canvas).toBe(canvasEle.nativeElement);
    });

    it('#setCanvas should update #context from the canvas element', () => {
        // Arrange
        const canvasStub = document.createElement('canvas');
        const canvasEle: ElementRef<HTMLCanvasElement> = new ElementRef<HTMLCanvasElement>(canvasStub);
        const context = canvasEle.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // Act
        service.setCanvas(canvasEle);

        // Assert
        expect(service.context).toBe(context);
    });

    it('#setBackgroundColor should set the canvas to white', () => {
        // Arrange
        const whiteColor = '#ffffff';
        const width = 600;
        const height = 500;
        const canvasStub = document.createElement('canvas');
        const canvasEle: ElementRef<HTMLCanvasElement> = new ElementRef<HTMLCanvasElement>(canvasStub);
        const context = canvasEle.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        service.canvas = canvasEle.nativeElement;
        service.context = context;
        service.gridCtx = context;

        // Act
        service.setSize(width, height);
        service.setBackgroundColorWhite();

        // Assert
        expect(service.context.fillStyle).toBe(whiteColor);
    });

    it('#setSize should update the canvas element size', () => {
        // Arrange
        const canvasStub = document.createElement('canvas');
        const canvasEle: ElementRef<HTMLCanvasElement> = new ElementRef<HTMLCanvasElement>(canvasStub);
        const context = canvasEle.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const width = 600;
        const height = 500;
        service.canvas = canvasEle.nativeElement;
        service.context = context;
        service.gridCtx = context;

        // Act
        service.setSize(width, height);

        // Assert
        expect(service.canvas.width).toBe(width);
        expect(service.canvas.height).toBe(height);
    });

    it('#getOffsetLeft should return the left offset of the canvas', () => {
        // Arrange
        const left = 500;
        const canvasSpy = jasmine.createSpyObj<HTMLCanvasElement>('HTMLCanvasElement', ['getBoundingClientRect']);
        canvasSpy.getBoundingClientRect.and.returnValue(new DOMRect(left, 0, 0, 0));
        service.canvas = canvasSpy;

        // Act
        const returnedLeftOffset = service.getOffsetLeft();

        // Assert
        expect(returnedLeftOffset).toBe(left);
    });

    it('#getOffsetTop should return the top offset of the canvas', () => {
        // Arrange
        const top = 500;
        const canvasSpy = jasmine.createSpyObj<HTMLCanvasElement>('HTMLCanvasElement', ['getBoundingClientRect']);
        canvasSpy.getBoundingClientRect.and.returnValue(new DOMRect(0, top, 0, 0));
        service.canvas = canvasSpy;

        // Act
        const returnedTopOffset = service.getOffsetTop();

        // Assert
        expect(returnedTopOffset).toBe(top);
    });

    it('#storeImageData should update #imageData', () => {
        // Arrange
        const canvasStub = document.createElement('canvas');
        const canvasEle: ElementRef<HTMLCanvasElement> = new ElementRef<HTMLCanvasElement>(canvasStub);
        const context = canvasEle.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        service.context = context;
        service.canvas = canvasEle.nativeElement;

        // Act
        service.storeImageData();

        // Assert
        expect(service['imageData']).toBeTruthy();
    });

    it('#storeImageData should call the context getImageData', () => {
        // Arrange
        const canvasStub = document.createElement('canvas');
        const canvasEle: ElementRef<HTMLCanvasElement> = new ElementRef<HTMLCanvasElement>(canvasStub);
        const context = canvasEle.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        service.context = context;
        service.canvas = canvasEle.nativeElement;
        service.canvas.width = 600;
        service.canvas.height = 700;
        const storeImageDataSpy = spyOn(service.context, 'getImageData');

        // Act
        service.storeImageData();

        // Assert
        expect(storeImageDataSpy).toHaveBeenCalled();
        expect(storeImageDataSpy).toHaveBeenCalledWith(0, 0, service.canvas.width, service.canvas.height);
    });

    it('#drawImage should call the context getImageData', () => {
        // Arrange
        const image = document.createElement('img');
        service.context = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', ['drawImage']);
        service.canvas = { width: 20, height: 20 } as any;

        // Act
        service.drawImage(image);

        // Assert
        expect(service.context.drawImage as any).toHaveBeenCalledWith(image, 0, 0, service.canvas.width, service.canvas.height);
    });

    it('#putImageData should call the context putImageData', () => {
        // Arrange
        const image = new ImageData(20, 20);
        service.context = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', ['putImageData']);
        service.canvas = { width: 20, height: 20 } as any;

        // Act
        service.putImageData(image);

        // Assert
        expect(service.context.putImageData).toHaveBeenCalledWith(image, 0, 0, 0, 0, service.canvas.width, service.canvas.height);
    });

    it('#restoreImageData should call the context putImageData', () => {
        // Arrange
        service['imageData'] = {} as ImageData;
        service.context = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', ['putImageData']);
        service.canvas = { width: 20, height: 20 } as HTMLCanvasElement;

        // Act
        service.restoreImageData();

        // Assert
        expect(service.context.putImageData).toHaveBeenCalledWith(service['imageData'], 0, 0, 0, 0, service.canvas.width, service.canvas.height);
    });

    it('#restoreImageData should not be called if imageData is not defined', () => {
        // Arrange
        service.context = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', ['putImageData']);
        service.canvas = { width: 20, height: 20 } as HTMLCanvasElement;

        // Act
        service.restoreImageData();

        // Assert
        expect(service.context.putImageData).not.toHaveBeenCalled();
    });

    it('#clearCanvas should clear the canvas', () => {
        // Arrange
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 500;
        spyOnProperty(service, 'width').and.returnValue(500);
        spyOnProperty(service, 'height').and.returnValue(500);
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.fillRect(0, 0, 150, 100);

        // Act
        service['clearCanvas'](context);
        const pixelBuffer = new Uint32Array(context.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);

        // Assert
        expect(hasColoredPixels).toEqual(false);
    });

    it('#width should return canvas width', () => {
        // Arrange
        const expectedWith = 2;
        service.canvas = { width: expectedWith } as HTMLCanvasElement;

        // Act
        const width = service.width;

        // Assert
        expect(width).toEqual(expectedWith);
    });

    it('#height should return canvas height', () => {
        // Arrange
        const expectedHeight = 2;
        service.canvas = { height: expectedHeight } as HTMLCanvasElement;

        // Act
        const height = service.height;

        // Assert
        expect(height).toEqual(expectedHeight);
    });

    it('#clean should clear  clear the canvas', () => {
        // Arrange
        spyOn(service, 'clearCanvas' as any);

        // Act
        service.clean();

        // Assert
        expect(service['clearCanvas']).toHaveBeenCalledWith(service.context);
    });

    it('#cleanPreview should clear  clear the canvas', () => {
        // Arrange
        spyOn(service, 'clearCanvas' as any);

        // Act
        service.cleanPreview();

        // Assert
        expect(service['clearCanvas']).toHaveBeenCalledWith(service.previewCtx);
    });

    it('#cleanGrid should clear  the grid the canvas', () => {
        // Arrange
        spyOn(service, 'clearCanvas' as any);

        // Act
        service.cleanGrid();

        // Assert
        expect(service['clearCanvas']).toHaveBeenCalledWith(service.gridCtx);
    });
});
