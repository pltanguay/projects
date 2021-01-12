import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorPicker } from '@app/classes/color-picker/color-picker';
import { Color, ColorAttributes } from '@app/classes/color/color';
import { MouseButton } from '@app/declarations/mouse.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tools/color/color.service';
import { ColorPickerService } from './color-picker.service';

// tslint:disable:no-string-literal

describe('ColorPickerService', () => {
    let service: ColorPickerService;
    let mouseEvent: PointerEvent;
    let pickerSpy: jasmine.SpyObj<ColorPickerService>;
    let colorPickerSpy: jasmine.SpyObj<ColorPicker>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let drawingService: jasmine.SpyObj<DrawingService>;
    let canvasStub;
    let canvasElement: ElementRef<HTMLCanvasElement>;
    let canvas: CanvasRenderingContext2D;
    let colorAttributes: ColorAttributes;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as PointerEvent;
        canvasStub = document.createElement('canvas');
        canvasElement = new ElementRef<HTMLCanvasElement>(canvasStub);
        canvas = canvasElement.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        colorAttributes = {
            red: 'ff',
            blue: 'ff',
            green: 'ff',
            opacity: 1,
        };

        pickerSpy = jasmine.createSpyObj('ColorPickerService', ['getPositionFromMouse']);
        colorPickerSpy = jasmine.createSpyObj('ColorPicker', ['calculateSurroundingPixels']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', ['setPrimaryColor', 'setSecondaryColor']);
        drawingService = {
            ...jasmine.createSpyObj('DrawingService', ['']),
            canvasWidth: 0,
            canvasHeight: 0,
            baseCtx: canvas,
        } as jasmine.SpyObj<DrawingService>;

        service = new ColorPickerService(drawingService, colorServiceSpy);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should return if the mouse is outside the canvas', () => {
        // Arrange
        service['mouseOut'] = true;

        // Act
        service.onMouseDown(mouseEvent);

        // Assert
        expect(pickerSpy['getPositionFromMouse']).not.toHaveBeenCalled();
    });

    it('#onMouseDown should call #setPrimaryColor upon left click', () => {
        // Arrange
        service['mouseOut'] = false;

        // Act
        service['currentColor'] = new Color(colorAttributes);
        service.onMouseDown(mouseEvent);

        // Assert
        expect(colorServiceSpy['setPrimaryColor']).toHaveBeenCalled();
        expect(colorServiceSpy['setSecondaryColor']).not.toHaveBeenCalled();
    });

    it('#onMouseDown should call #setSecondaryColor upon right click', () => {
        // Arrange
        service['mouseOut'] = false;
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;

        // Act
        service['currentColor'] = new Color(colorAttributes);
        service.onMouseDown(mouseEvent);

        // Assert
        expect(colorServiceSpy['setPrimaryColor']).not.toHaveBeenCalled();
        expect(colorServiceSpy['setSecondaryColor']).toHaveBeenCalled();
    });

    it('#onMouseMove should return if the mouse is outside the canvas', () => {
        // Arrange
        service['mouseOut'] = true;

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(pickerSpy['getPositionFromMouse']).not.toHaveBeenCalled();
        expect(colorPickerSpy['calculateSurroundingPixels']).not.toHaveBeenCalled();
    });

    it('#onMouseMove should update #colorPicker', () => {
        // Arrange
        service['mouseOut'] = false;
        service['colorPicker'] = new ColorPicker();

        // Assert
        expect(service['colorPicker']['pixelPicker'].middlePixel).toEqual('');

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        service.getColorsObservable().subscribe((pickerObservable) => {
            expect(service['colorPicker']['pixelPicker'].middlePixel).not.toEqual('');
            expect(service['colorPicker']['pixelPicker'].middlePixel).toEqual(pickerObservable.middlePixel);
        });
    });

    it('#onMouseOut should return if the the mouse is not moving', () => {
        // Arrange
        spyOn(service['pickerSubject'], 'next');
        service['isMoving'] = false;

        // Act
        service.onMouseOut(mouseEvent);

        // Assert
        expect(service['pickerSubject'].next).not.toHaveBeenCalled();
    });
    it('#onMouseOut should set #shouldPickerBeAvailable to false', () => {
        // Arrange
        service['mouseOut'] = false;
        service['isMoving'] = true;

        // Act
        service.onMouseOut(mouseEvent);

        // Assert
        expect(service['mouseOut']).toBe(true);
        service.getColorsObservable().subscribe((pickerObservable) => {
            expect(pickerObservable.shouldPickerBeAvailable).toBe(false);
        });
    });
});
