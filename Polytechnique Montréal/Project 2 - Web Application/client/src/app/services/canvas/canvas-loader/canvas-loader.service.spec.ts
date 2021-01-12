import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InitialMemento } from '@app/classes/undo-redo/memento/initial-memento';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { LocalStorageService } from '@app/services/local-storage/local-storage.service';
import { ResizeService } from '@app/services/resize/resize.service';
import { DrawingData } from '@common/communication/drawing-data';
import { of } from 'rxjs';
import { CanvasLoaderService } from './canvas-loader.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:max-classes-per-file
// tslint:disable:no-shadowed-variable

describe('CanvasLoaderService', () => {
    let service: CanvasLoaderService;

    let localStorageService: jasmine.SpyObj<LocalStorageService>;
    let resizeService: jasmine.SpyObj<ResizeService>;
    let canvasService: jasmine.SpyObj<CanvasService>;
    let routerStub: jasmine.SpyObj<Router>;

    beforeEach(() => {
        resizeService = jasmine.createSpyObj('ResizeService', ['resize']);
        localStorageService = jasmine.createSpyObj('LocalStorageService', ['save']);
        canvasService = jasmine.createSpyObj('CanvasService', ['drawImage', 'getImageData']);
        routerStub = jasmine.createSpyObj('Router', ['navigateByUrl']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: Router, useValue: routerStub },
                { provide: ResizeService, useValue: resizeService },
                { provide: CanvasService, useValue: canvasService },
                { provide: LocalStorageService, useValue: localStorageService },
            ],
        });
        service = TestBed.inject(CanvasLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#openDrawing should call #getImage and save action', fakeAsync(() => {
        // Arrange
        let initialMemento;
        const htmlElement: HTMLImageElement = {} as HTMLImageElement;
        const drawing: DrawingData = { drawingName: 'TsPaint', tags: [] };
        spyOn(service, 'getImage').and.returnValue(of(htmlElement));

        service.openDrawing(drawing.imageBase64 as string).subscribe((momento) => (initialMemento = momento));

        // Act
        tick();

        // Assert
        expect(initialMemento).not.toBeNull();
        expect(service.getImage).toHaveBeenCalled();
    }));

    it('#openDrawing should call #getImage and save action', fakeAsync(() => {
        // Arrange
        spyOn(service, 'getImage').and.returnValue(of({ width: 2, height: 2 } as HTMLImageElement));

        // Act
        service.openDrawing('test').subscribe((memento: InitialMemento) => {
            return;
        });
        tick();

        // Assert
        expect(routerStub.navigateByUrl).toHaveBeenCalledWith('/editor-space');
    }));

    it('#getImage should get the image', fakeAsync(() => {
        // Arrange
        let expectedImage;
        const IMAGE_TIMEOUT = 100;
        const image = global.Image;
        global.Image = class {
            onload: any;
            constructor() {
                setTimeout(() => {
                    this.onload(); // simulate success
                }, IMAGE_TIMEOUT);
            }
        } as any;

        service.getImage('image').subscribe((image) => (expectedImage = image));

        // Act
        tick(IMAGE_TIMEOUT);

        // Assert
        expect(expectedImage).not.toBeNull();
        global.Image = image;
    }));
});
