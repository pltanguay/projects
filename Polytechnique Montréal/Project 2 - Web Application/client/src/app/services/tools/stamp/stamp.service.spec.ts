import { Renderer2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH, DEFAULT_STAMP_URL } from '@app/classes/tool/tool';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { MouseButton } from '@app/declarations/mouse.enum';
import { MaterialModule } from '@app/material.module';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { Size } from '@app/services/workspace/workspace.service';
import { of } from 'rxjs';
import { StampService } from './stamp.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:max-classes-per-file
// tslint:disable:max-file-line-count
describe('StampService', () => {
    let service: StampService;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasStub: HTMLCanvasElement;
    let canvasContext: CanvasRenderingContext2D;
    let rendererSpy: jasmine.SpyObj<Renderer2>;
    let mouseEvent: PointerEvent;
    let image: any;

    beforeEach(() => {
        rendererSpy = jasmine.createSpyObj('Renderer2', ['createElement']);
        snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);
        canvasStub = canvasTestHelper.canvas;
        canvasContext = canvasStub.getContext('2d') as CanvasRenderingContext2D;

        image = global.Image;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as PointerEvent;

        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
            canvasWidth: 100,
            canvasHeight: 100,
            baseCtx: canvasContext,
        } as jasmine.SpyObj<DrawingService>;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: SnapshotFactoryService, useValue: snapshotFactory },
            ],
            imports: [MaterialModule],
        });
        service = TestBed.inject(StampService);
        service['renderer'] = rendererSpy;
    });

    afterEach(() => {
        global.Image = image;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' #initialiseValues should call #resetValues, #buildBufferContext and #drawCanvasElementFromSVG and set default values ', () => {
        // Arrange
        const spyResetValue = spyOn<any>(service, 'resetValues');
        const spyBuildContext = spyOn<any>(service, 'buildBufferContext');
        const spyDraw = spyOn<any>(service, 'drawCanvasElementFromSVG');
        const expectedSIze: Size = {
            width: DEFAULT_CANVAS_WIDTH,
            height: DEFAULT_CANVAS_HEIGHT,
        };
        // Act
        service.initialiseValues();

        // Assert
        expect(spyResetValue).toHaveBeenCalled();
        expect(spyBuildContext).toHaveBeenCalled();
        expect(spyDraw).toHaveBeenCalled();
        expect(service.stampURL).toEqual(DEFAULT_STAMP_URL);
        expect(service.isURLDefault).toEqual(true);
        expect(service.svgSize).toEqual(expectedSIze);
    });

    it(' #getAngleObservable should call #asObservable', () => {
        // Arrange
        const spyAsObservable = spyOn<any>(service['angleSubject'], 'asObservable');
        // Act
        service.getAngleObservable();

        // Assert
        expect(spyAsObservable).toHaveBeenCalled();
    });

    it(' #onMouseDown should call #drawbase and #save if #isLeftClick is true and #isURLDefault is false', () => {
        // Arrange
        service.isURLDefault = false;

        // Act
        service.onMouseDown(mouseEvent);

        // Assert
        expect(drawServiceSpy['drawBase']).toHaveBeenCalled();
        expect(snapshotFactory['save']).toHaveBeenCalled();
    });

    it(' #onMouseDown shouldnt call #drawbase and #save if #isLeftClick is false and #isURLDefault is false', () => {
        // Arrange
        service.isURLDefault = false;
        const mouseEventRight = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;

        // Act
        service.onMouseDown(mouseEventRight);

        // Assert
        expect(drawServiceSpy['drawBase']).not.toHaveBeenCalled();
        expect(snapshotFactory['save']).not.toHaveBeenCalled();
    });

    it('#onMouseOut should do nothing if mouse position is in canvas', () => {
        // Arrange
        const mouseEventOut = {
            offsetX: 100,
            offsetY: 100,
            button: MouseButton.Left,
        } as PointerEvent;

        spyOn<any>(service, 'isReallyOut').and.returnValue(false);
        const spyClean = spyOn<any>(service, 'clearStampPreview');

        // Act
        service.onMouseOut(mouseEventOut);

        // Assert
        expect(spyClean).not.toHaveBeenCalled();
    });

    it('#onMouseOut should call #clearStampPreview if mouse position is not in canvas', () => {
        // Arrange
        const mouseEventOut = {
            offsetX: 100,
            offsetY: 100,
            button: MouseButton.Left,
        } as PointerEvent;

        spyOn<any>(service, 'isReallyOut').and.returnValue(true);
        const spyClean = spyOn<any>(service, 'clearStampPreview');

        // Act
        service.onMouseOut(mouseEventOut);

        // Assert
        expect(spyClean).toHaveBeenCalled();
    });

    it(' #onMouseMove should call #getPositionFromMouse and #drawPreviewStamp', () => {
        // Arrange
        const spyDrawPreviewStamp = spyOn<any>(service, 'drawPreviewStamp');

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(spyDrawPreviewStamp).toHaveBeenCalled();
    });

    it('#onWheelScroll should set #angle to -15 if alt is not pressed and scroll 1 Y+', () => {
        // Arrange
        service.isURLDefault = false;
        service.angle = 0;
        const mouseEventWheel = {
            deltaY: 1,
            altKey: false,
        } as WheelEvent;
        spyOn<any>(service, 'validateLimits');
        spyOn<any>(service, 'drawPreviewStamp');

        // Act
        service.onWheelScroll(mouseEventWheel);

        // Assert
        expect(service.angle).toEqual(-15);
    });

    it(' #onWheelScroll should set #angle to 1 if alt is pressed and scroll 1 Y-', () => {
        // Arrange
        service.isURLDefault = false;
        service.angle = 0;
        const mouseEventWheel = {
            deltaY: -1,
            altKey: true,
        } as WheelEvent;
        spyOn<any>(service, 'validateLimits');
        spyOn<any>(service, 'drawPreviewStamp');

        // Act
        service.onWheelScroll(mouseEventWheel);

        // Assert
        expect(service.angle).toEqual(1);
    });

    it(' #onWheelScroll should do nothing if #isURLDefault is true', () => {
        // Arrange
        service.isURLDefault = true;
        service.angle = 0;
        const mouseEventWheel = {
            deltaY: -1,
            altKey: true,
        } as WheelEvent;
        const spyValidateLimits = spyOn<any>(service, 'validateLimits');
        const spyUpdateAngle = spyOn<any>(service, 'updateAngle');
        const spyDrawPreviewStamp = spyOn<any>(service, 'drawPreviewStamp');

        // Act
        service.onWheelScroll(mouseEventWheel);

        // Assert
        expect(spyValidateLimits).not.toHaveBeenCalled();
        expect(spyUpdateAngle).not.toHaveBeenCalled();
        expect(spyDrawPreviewStamp).not.toHaveBeenCalled();
    });

    it(' #clearStampPreview should clean preview', () => {
        // Arrange

        // Act
        service.clearStampPreview();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
    });

    it(' #updateStampPreview should clean preview', () => {
        // Arrange
        const spyDraw = spyOn<any>(service, 'drawCanvasElementFromSVG');

        // Act
        service.updateStampPreview();

        // Assert
        expect(spyDraw).toHaveBeenCalled();
    });

    it(' #drawCanvasElementFromSVG should call ##buildContext, #scaleDrawnCanvas and #drawSvgInCanvas', fakeAsync(() => {
        // Arrange
        global.Image = class {
            onload: any;
            constructor() {
                setTimeout(() => {
                    this.onload(); // simulate success
                }, 100);
            }
        } as any;
        const htmlElement: HTMLImageElement = {} as HTMLImageElement;
        const spyBuild = spyOn<any>(service, 'buildBufferContext');
        const spyScale = spyOn<any>(service, 'scaleDrawnCanvas');
        const spyDraw = spyOn<any>(service, 'drawSvgInCanvas').and.returnValue(of(htmlElement));

        // Act
        service['drawCanvasElementFromSVG']();
        tick(100);

        // Assert
        expect(spyScale).toHaveBeenCalled();
        expect(spyDraw).toHaveBeenCalled();
        expect(spyBuild).toHaveBeenCalled();
    }));

    it(' #updateAngle should set #angle to 9, with #deltaY = 1, if current #angle is 10', () => {
        // Arrange
        service.angle = 40;

        // Act
        service['updateAngle'](1, false);

        // Assert
        expect(service.angle).toEqual(25);
    });

    it(' #updateAngle should set #angle to 11, with #deltaY = -1, if current #angle is 10', () => {
        // Arrange
        service.angle = 10;

        // Act
        service['updateAngle'](-1, true);

        // Assert
        expect(service.angle).toEqual(11);
    });

    it(' #validateLimits should set #angle to 360 if #angle is -1', () => {
        // Arrange
        service.angle = -1;

        // Act
        service['validateLimits']();

        // Assert
        expect(service.angle).toEqual(360);
    });

    it(' #validateLimits should set #angle to 0 if #angle is 361', () => {
        // Arrange
        service.angle = 361;

        // Act
        service['validateLimits']();

        // Assert
        expect(service.angle).toEqual(0);
    });

    it(' #drawPreviewStamp should #cleanPreview, create a new Stamp and #drawPreview ', () => {
        // Arrange
        service.angle = 15;

        // Act
        service['drawPreviewStamp'](mouseEvent);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(service['stamp']).not.toBeNull();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it(' #buildBufferContext should create a canvas context', () => {
        // Arrange
        rendererSpy.createElement.and.returnValue(canvasStub);

        // Act
        service['buildBufferContext']();

        // Assert
        expect(service['bufferContext']).not.toBeNull();
    });

    it(' #scaleDrawnCanvas should set canvas size', () => {
        // Arrange
        service.svgSize = { width: 20, height: 30 };
        service.scaleFactor = 2;

        // Act
        service['scaleDrawnCanvas']();

        // Assert
        expect(service['bufferContext'].canvas.width).toEqual(40);
        expect(service['bufferContext'].canvas.height).toEqual(60);
    });

    it(' #drawSvgInCanvas should #drawImage', fakeAsync(() => {
        // Arrange
        global.Image = class {
            onload: any;
            constructor() {
                setTimeout(() => {
                    this.onload(); // simulate successk
                }, 100);
            }
        } as any;
        service.stampURL = 'assets/stamps/default.png';
        const spyDraw = spyOn<any>(service['bufferContext'], 'drawImage');

        // Act
        service['drawSvgInCanvas']();
        tick(100);

        // Assert
        expect(spyDraw).toHaveBeenCalled();
    }));
});
