import { Vec2 } from '@app/classes/interfaces/vec2';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';

export const DEFAULT_TOOL_WIDTH = 1;
export const DEFAULT_TOOL_FREQUENCY = 20;
export const MILLISECONDS_1000 = 1000;
export const DEFAULT_POINTS_PER_SPLASH = 20;
export const DEFAULT_SPLASH_WIDTH = 10;
export const DEFAULT_DROPLET_WIDTH = 1;
export const DEFAULT_ANGLE = 0;
export const DEFAULT_SCALEFACTOR = 1;
export const ANGLE_OFFSET = 15;
export const DEFAULT_STAMP_URL = 'assets/stamps/default.png';
export const DEFAULT_CANVAS_WIDTH = 210;
export const DEFAULT_CANVAS_HEIGHT = 53;
export const STAMP_DEFAULT_CANVAS_SIZE = 200;

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    protected mousePosition: Vec2;
    protected mouseDown: boolean = false;
    protected mouseOut: boolean = false;

    readonly type: ToolType;
    isProcessing: boolean = false;

    constructor(protected drawingService: DrawingService) {}

    onWheelScroll(event: WheelEvent): void {}

    onMouseDown(event: PointerEvent): void {}

    onMouseUp(event: PointerEvent): void {}

    onMouseMove(event: PointerEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onMouseOut(event: MouseEvent): void {}

    onMouseClick(event: MouseEvent): void {}

    onMouseDoubleClick(event: MouseEvent): void {}

    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    onKeyPress(event: KeyboardEvent): void {}

    startDrawing(): void {}

    stopDrawing(): void {}

    protected getPositionFromMouse(event: PointerEvent | MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    protected isReallyOut(event: PointerEvent | MouseEvent): boolean {
        return (
            event.offsetX < 0 ||
            event.offsetX > this.drawingService.baseCtx.canvas.width ||
            event.offsetY < 0 ||
            event.offsetY > this.drawingService.baseCtx.canvas.height
        );
    }
}
