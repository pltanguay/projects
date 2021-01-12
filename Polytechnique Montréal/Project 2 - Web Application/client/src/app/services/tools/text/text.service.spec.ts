import { TestBed } from '@angular/core/testing';
import { TextField } from '@app/classes/text/text-field';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { MouseButton } from '@app/declarations/mouse.enum';
import { DashedShapeService } from '@app/services/dashed-shape/dashed-shape.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { POLICE, TextService } from '@app/services/tools/text/text.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { TextUtilsService } from './text-utils.service';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:max-file-line-count
// tslint:disable:no-any
describe('TextService', () => {
    let service: TextService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let dashedShapeServiceSpy: jasmine.SpyObj<DashedShapeService>;
    let eventSpy: jasmine.SpyObj<KeyboardEvent>;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;
    let textUtilsSpy: jasmine.SpyObj<TextUtilsService>;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'fillText');
        spyOn(ctxStub, 'measureText');

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase', 'pushData', 'previewCtx']);
        dashedShapeServiceSpy = jasmine.createSpyObj('DashedShapeService()', ['getDashedRectangle']);
        eventSpy = jasmine.createSpyObj('KeyboardEvent()', ['preventDefault']);
        snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);
        textUtilsSpy = jasmine.createSpyObj('TextUtilsService', [
            'getPositionIndicator',
            'initializeData',
            'deletePreviousCharacter',
            'deleteNextCharacter',
            'changeLine',
            'moveLeft',
            'moveRight',
            'moveUp',
            'moveDown',
            'addCharacter',
        ]);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: DashedShapeService, useValue: dashedShapeServiceSpy },
                { provide: KeyboardEvent, useValue: eventSpy },
                { provide: SnapshotFactoryService, useValue: snapshotFactory },
                { provide: TextUtilsService, useValue: textUtilsSpy },
            ],
        });
        service = TestBed.inject(TextService);

        service.isProcessing = true;

        service.textField = new TextField(new Point(0, 0), {
            size: 20,
            police: POLICE[0],
            isBold: false,
            isItalic: false,
            align: 'left',
            color: 'black',
        });

        service.textField.text[0] = 'Hello ';
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' #onMouseUp should do nothing if it is not a left click', () => {
        // Arrange
        const spyDraw = spyOn<any>(service, 'drawPreviewText');

        service.isProcessing = false;
        const mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;

        // Act
        service['onMouseUp'](mouseEvent);

        // Assert
        expect(spyDraw).not.toHaveBeenCalled();
    });

    it(' #onMouseUp should create a TextField if we are not currently writing', () => {
        // Arrange
        const spyDraw = spyOn<any>(service, 'drawPreviewText');

        service.isProcessing = false;
        const mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as PointerEvent;

        // Act
        service['onMouseUp'](mouseEvent);

        // Assert
        expect(service['isProcessing']).toBe(true);
        expect(service.textField.startPoint.x).toEqual(mouseEvent.offsetX);
        expect(service.textField.startPoint.y).toEqual(mouseEvent.offsetY);
        expect(spyDraw).toHaveBeenCalled();
    });

    it(' #onMouseUp should draw the text if we are currently writing', () => {
        // Arrange
        service.isProcessing = true;
        const mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as PointerEvent;
        spyOn<any>(service, 'stopDrawing');

        // Act
        service['onMouseUp'](mouseEvent);

        // Assert
        expect(service['stopDrawing']).toHaveBeenCalled();
    });

    it('#registerShortcuts should register service shortcuts', () => {
        // Arrange
        spyOn(service['keyMap'], 'set');

        // Act
        service['registerShortcuts']();

        // Assert
        expect(service['keyMap'].set).toHaveBeenCalledTimes(8);
    });

    it('#onKeyDown should do nothing if we are processing', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.ESC, repeat: false, ctrlKey: false, shiftKey: false });
        spyOn(service['keyMap'], 'get');
        service.isProcessing = false;

        // Act
        service.onKeyDown(event);

        // Assert
        expect(service['keyMap'].get).not.toHaveBeenCalled();
    });

    it('#onKeyDown with escape should cancel text', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.ESC, repeat: false, ctrlKey: false, shiftKey: false });
        const actionSpy = spyOn<any>(service, 'cancelText');
        const drawPreviewSpy = spyOn<any>(service, 'drawPreviewText');
        spyOn(service.textField, 'setProperty').and.returnValue();
        // Act
        service.onKeyDown(event);

        // Assert
        expect(actionSpy).toHaveBeenCalled();
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it('#onKeyDown with backspace should delete previous character', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.BS, repeat: false, ctrlKey: false, shiftKey: false });
        const drawPreviewSpy = spyOn<any>(service, 'drawPreviewText');
        spyOn(service.textField, 'setProperty').and.returnValue();
        // Act
        service.onKeyDown(event);

        // Assert
        expect(textUtilsSpy.deletePreviousCharacter).toHaveBeenCalled();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('#onKeyDown with delete should delete next character', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.DEL, repeat: false, ctrlKey: false, shiftKey: false });
        const drawPreviewSpy = spyOn<any>(service, 'drawPreviewText');
        spyOn(service.textField, 'setProperty').and.returnValue();
        // Act
        service.onKeyDown(event);

        // Assert
        expect(textUtilsSpy.deleteNextCharacter).toHaveBeenCalled();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('#onKeyDown with enter should change line', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.ENT, repeat: false, ctrlKey: false, shiftKey: false });
        const drawPreviewSpy = spyOn<any>(service, 'drawPreviewText');
        spyOn(service.textField, 'setProperty').and.returnValue();
        // Act
        service.onKeyDown(event);

        // Assert
        expect(textUtilsSpy.changeLine).toHaveBeenCalled();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('#onKeyDown with left arrow should move to the left in the text', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.LEFT_ARROW, repeat: false, ctrlKey: false, shiftKey: false });
        const drawPreviewSpy = spyOn<any>(service, 'drawPreviewText');
        spyOn(service.textField, 'setProperty').and.returnValue();
        // Act
        service.onKeyDown(event);

        // Assert
        expect(textUtilsSpy.moveLeft).toHaveBeenCalled();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('#onKeyDown with right arrow should move to the left in the text', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.RIGHT_ARROW, repeat: false, ctrlKey: false, shiftKey: false });
        const drawPreviewSpy = spyOn<any>(service, 'drawPreviewText');
        spyOn(service.textField, 'setProperty').and.returnValue();
        // Act
        service.onKeyDown(event);

        // Assert
        expect(textUtilsSpy.moveRight).toHaveBeenCalled();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('#onKeyDown with up arrow should move up in the text', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.UP_ARROW, repeat: false, ctrlKey: false, shiftKey: false });
        const drawPreviewSpy = spyOn<any>(service, 'drawPreviewText');
        spyOn(service.textField, 'setProperty').and.returnValue();
        // Act
        service.onKeyDown(event);

        // Assert
        expect(textUtilsSpy.moveUp).toHaveBeenCalled();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('#onKeyDown with down arrow should move down in the text', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.DOWN_ARROW, repeat: false, ctrlKey: false, shiftKey: false });
        const drawPreviewSpy = spyOn<any>(service, 'drawPreviewText');
        spyOn(service.textField, 'setProperty').and.returnValue();
        // Act
        service.onKeyDown(event);

        // Assert
        expect(textUtilsSpy.moveDown).toHaveBeenCalled();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('#onKeyDown with a valid character should add it in the text', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.A, repeat: false, ctrlKey: false, shiftKey: false });
        const drawPreviewSpy = spyOn<any>(service, 'drawPreviewText');
        spyOn(service.textField, 'setProperty').and.returnValue();
        // Act
        service.onKeyDown(event);

        // Assert
        expect(textUtilsSpy.addCharacter).toHaveBeenCalled();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });
    it('#onKeyDown with an invalid character should do nothing', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.F1, repeat: false, ctrlKey: false, shiftKey: false });
        const drawPreviewSpy = spyOn<any>(service, 'drawPreviewText');
        spyOn(service.textField, 'setProperty').and.returnValue();
        // Act
        service.onKeyDown(event);

        // Assert
        expect(textUtilsSpy.addCharacter).not.toHaveBeenCalled();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it(' #cancelText should clean the Canvas', () => {
        // Arrange

        // Act
        service['cancelText']();

        // Assert
        expect(service['isProcessing']).toBe(false);
        expect(drawServiceSpy['cleanPreview']).toHaveBeenCalled();
    });

    it(' #drawPreviewText should draw the preview (text and indicator and bounding box and update the attribute', () => {
        // Arrange
        spyOn<any>(service, 'drawBoundingBox');
        spyOn<any>(service, 'drawIndicator');
        textUtilsSpy.getPositionIndicator.and.returnValue(new Point(20, 10));
        service.isProcessing = true;
        // Act
        service.drawPreviewText();

        // Assert
        expect(drawServiceSpy['cleanPreview']).toHaveBeenCalled();
        expect(drawServiceSpy['drawPreview']).toHaveBeenCalledWith(service.textField);
        expect(service['drawIndicator']).toHaveBeenCalled();
        expect(service['drawBoundingBox']).toHaveBeenCalled();
    });
    it(' #drawPreviewText should draw the preview (text and indicator and bounding box', () => {
        // Arrange
        spyOn<any>(service, 'drawBoundingBox');
        spyOn<any>(service, 'drawIndicator');
        textUtilsSpy.getPositionIndicator.and.returnValue(new Point(20, 10));
        service.isProcessing = false;
        // Act
        service.drawPreviewText();

        // Assert
        expect(drawServiceSpy['cleanPreview']).toHaveBeenCalled();
        expect(drawServiceSpy['drawPreview']).toHaveBeenCalledWith(service.textField);
        expect(service['drawIndicator']).toHaveBeenCalled();
        expect(service['drawBoundingBox']).toHaveBeenCalled();
    });

    it(' #drawBoundingBox should draw a box all around the textField', () => {
        // Arrange
        spyOn<any>(service, 'getUpperLeftPoint').and.returnValue(new Point(10, 10));
        spyOn<any>(service, 'getLowerRightPoint').and.returnValue(new Point(20, 12));
        spyOn<any>(service.textField, 'getWidth').and.returnValue(8);

        // Act
        service['drawBoundingBox'](ctxStub);

        // Assert
        expect(dashedShapeServiceSpy['getDashedRectangle']).toHaveBeenCalled();
        expect(drawServiceSpy['drawPreview']).toHaveBeenCalled();
    });
    it(' #drawIndicator should draw the indicator at the right position', () => {
        // Arrange
        textUtilsSpy.getPositionIndicator.and.returnValue(new Point(10, 10));
        // Act
        service['drawIndicator'](ctxStub);

        // Assert
        expect(ctxStub.fillText).toHaveBeenCalled();
    });

    it(' #stopDrawing when text is not empty', () => {
        // Arrange

        // Act
        service['stopDrawing']();

        // Assert
        expect(drawServiceSpy['cleanPreview']).toHaveBeenCalled();
        expect(drawServiceSpy['drawBase']).toHaveBeenCalled();
        expect(snapshotFactory['save']).toHaveBeenCalled();
    });

    it(' #stopDrawing when text is empty', () => {
        // Arrange
        service.textField.text[0] = ' ';

        // Act
        service['stopDrawing']();

        // Assert
        expect(drawServiceSpy['cleanPreview']).toHaveBeenCalled();
        expect(drawServiceSpy['drawBase']).not.toHaveBeenCalled();
        expect(snapshotFactory['save']).not.toHaveBeenCalled();
    });
    it(' #stopDrawing should return if we are not processing', () => {
        // Arrange
        service.isProcessing = false;

        // Act
        service['stopDrawing']();

        // Assert
        expect(drawServiceSpy['cleanPreview']).toHaveBeenCalled();
        expect(drawServiceSpy['drawBase']).not.toHaveBeenCalled();
        expect(snapshotFactory['save']).not.toHaveBeenCalled();
    });

    it(' #getUpperLeftPoint should return the upper left point of the bounding box', () => {
        // Arrange
        service['mousePosition'] = new Point(10, 10);

        // Act
        const result = service['getUpperLeftPoint']();

        // Assert
        expect(result.x).toBeLessThan(10);
        expect(result.y).toBeLessThan(10);
    });

    it(' #getLowerRightPoint should return the lower right point of the bounding box', () => {
        // Arrange
        service['mousePosition'] = new Point(10, 10);

        // Act
        const result = service['getLowerRightPoint'](10);

        // Assert
        expect(result.x).toBeGreaterThan(20);
        expect(result.y).toBeLessThan(20);
    });

    it(' #getEventObservable', () => {
        // Arrange

        // Act
        const result = service.getEventObservable();

        // Assert
        expect(result).toEqual(service['subject'].asObservable());
    });

    it(' #isTextFieldEmpty', () => {
        // Arrange
        service.textField.text[0] = '';
        service.textField.text[1] = '      ';
        // Act
        const result = service['isTextFieldEmpty']();

        // Assert
        expect(result).toBe(true);
    });
});
