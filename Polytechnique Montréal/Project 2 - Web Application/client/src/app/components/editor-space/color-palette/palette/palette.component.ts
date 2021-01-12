import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Color, ColorAttributes } from '@app/classes/color/color';
import { Point } from '@app/classes/utils/point';

const HEIGHT_OFFSET = 20;
const WIDTH_OFFSET = 4;
const INITIAL_BLUE_COLOR = 'rgba(62, 118, 169, 1)';

@Component({
    selector: 'app-palette',
    templateUrl: './palette.component.html',
    styleUrls: ['./palette.component.scss'],
})
export class PaletteComponent implements AfterViewInit, OnChanges {
    @Input()
    rgbColor: string;

    @Input()
    hueValue: number;

    @Output()
    canvasColor: EventEmitter<Color> = new EventEmitter(true);

    @ViewChild('paletteCanvas')
    paletteCanvas: ElementRef<HTMLCanvasElement>;

    offsetX: string;
    offsetY: string;
    clickedOffsetX: string;
    clickedOffsetY: string;

    private isMouseDown: boolean;
    private currentPoint: Point;
    private color: Color;
    private context: CanvasRenderingContext2D;
    private canvasWidth: number;
    private canvasHeight: number;

    ngAfterViewInit(): void {
        this.initialiseValues();
        this.drawOnCanvas();
    }

    private initialiseValues(): void {
        this.currentPoint = { x: 0, y: 0 };
        this.context = this.paletteCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvasWidth = this.paletteCanvas.nativeElement.width;
        this.canvasHeight = this.paletteCanvas.nativeElement.height;
        this.color = new Color();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.rgbColor) {
            // called only when dragged
            if (this.rgbColor) {
                this.drawOnCanvas();
            }
        }
    }

    onMouseDownCanvas(event: MouseEvent): void {
        this.isMouseDown = true;
        this.setCurrentPoints(event);
        this.emitLatestColor(event);
    }

    onMouseUpCanvas(): void {
        this.isMouseDown = false;
    }

    onMouseMoveCanvas(event: MouseEvent): void {
        this.setCurrentPoints(event);

        if (this.isMouseDown) {
            this.emitLatestColor(event);
        }
    }

    private drawOnCanvas(): void {
        let whiteGradient: CanvasGradient;
        let blackGradient: CanvasGradient;

        // set default blue color for canvas
        if (!this.rgbColor) this.rgbColor = INITIAL_BLUE_COLOR;

        // update canvas gradient color
        this.fillCanvas(this.rgbColor);
        whiteGradient = this.context.createLinearGradient(0, 0, this.canvasWidth - WIDTH_OFFSET, 0);
        whiteGradient.addColorStop(0, 'white');
        whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.fillCanvas(whiteGradient);

        blackGradient = this.context.createLinearGradient(0, 0, 0, this.canvasHeight - HEIGHT_OFFSET);
        blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        blackGradient.addColorStop(1, 'black');
        this.fillCanvas(blackGradient);
    }

    // applies color on canvas and redraw it
    private fillCanvas(color: CanvasGradient | string): void {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    private emitLatestColor(event: MouseEvent): void {
        this.clickedOffsetX = `${event.offsetX}px`;
        this.clickedOffsetY = `${event.offsetY}px`;
        this.setPointColor(this.currentPoint.x, this.currentPoint.y);
        this.canvasColor.emit(this.color);
    }

    // update points coordinate
    private setCurrentPoints(event: MouseEvent): void {
        this.currentPoint = {
            x: event.offsetX,
            y: event.offsetY,
        };

        this.offsetX = `${this.currentPoint.x}px`;
        this.offsetY = `${this.currentPoint.y}px`;
    }

    // set actual color from coordinate where mouse clicked
    private setPointColor(x: number, y: number): void {
        const colorData: Uint8ClampedArray = this.context.getImageData(x, y, 1, 1).data;
        const newColor: ColorAttributes = {
            red: this.color.rgbToHexadecimal(colorData[0]),
            green: this.color.rgbToHexadecimal(colorData[1]),
            blue: this.color.rgbToHexadecimal(colorData[2]),
            opacity: 1,
            hueValue: this.hueValue,
            hexCode: `#${this.color.rgbToHexadecimal(colorData[0])}${this.color.rgbToHexadecimal(colorData[1])}${this.color.rgbToHexadecimal(
                colorData[2],
            )}`,
        };
        this.color = new Color(newColor);
    }
}
