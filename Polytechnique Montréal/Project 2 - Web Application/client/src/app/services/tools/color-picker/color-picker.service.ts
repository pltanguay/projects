import { Injectable } from '@angular/core';
import { ColorPicker, PixelPicker } from '@app/classes/color-picker/color-picker';
import { Color } from '@app/classes/color/color';
import { DEFAULT_TOOL_WIDTH, Tool } from '@app/classes/tool/tool';
import { MouseButton } from '@app/declarations/mouse.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tools/color/color.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColorPickerService extends Tool {
    width: number;
    color: string;
    readonly type: ToolType;

    private isMoving: boolean;
    private currentColor: Color;
    private colorPicker: ColorPicker;
    private pickerSubject: BehaviorSubject<PixelPicker>;

    constructor(protected drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService);
        this.type = ToolType.ColorPicker;
        this.initialiseValues();
    }

    private initialiseValues(): void {
        this.width = DEFAULT_TOOL_WIDTH;
        this.currentColor = new Color();
        this.colorPicker = new ColorPicker();
        this.pickerSubject = new BehaviorSubject<PixelPicker>(this.colorPicker.pixelPicker);
    }

    getColorsObservable(): Observable<PixelPicker> {
        return this.pickerSubject.asObservable(); // emits
    }

    onMouseDown(event: PointerEvent): void {
        this.mouseDown = true;
        this.isMoving = false;
        if (this.mouseOut) return;

        this.mousePosition = this.getPositionFromMouse(event);
        this.colorPicker.calculateSurroundingPixels(this.mousePosition, this.drawingService.baseCtx);
        this.currentColor = this.colorPicker.currentColor;
        this.pickerSubject.next(this.colorPicker.pixelPicker);

        if (event.button === MouseButton.Left) {
            this.colorService.setPrimaryColor(this.currentColor.rgbaValue);
        }

        if (event.button === MouseButton.Right) {
            this.colorService.setSecondaryColor(this.currentColor.rgbaValue);
        }
    }

    onMouseMove(event: PointerEvent): void {
        this.makePickerAvailable();
        this.isMoving = true;
        this.mousePosition = this.getPositionFromMouse(event);
        this.mousePosition = {
            x: Math.floor(this.mousePosition.x),
            y: Math.floor(this.mousePosition.y),
        };
        this.colorPicker.calculateSurroundingPixels(this.mousePosition, this.drawingService.baseCtx);
        this.pickerSubject.next(this.colorPicker.pixelPicker);
    }

    onMouseOut(event: PointerEvent): void {
        if (!this.isMoving) return;

        this.mouseOut = true;
        this.colorPicker.pickerAvailability = false;
        this.pickerSubject.next(this.colorPicker.pixelPicker);
    }

    private makePickerAvailable(): void {
        this.mouseDown = false;
        this.mouseOut = false;
        this.colorPicker.pickerAvailability = true;
    }
}
