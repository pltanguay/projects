import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { MAX_SQUARE_SIZE, MIN_SQUARE_SIZE } from '@app/declarations/sliders-edges';
import { ToolType } from '@app/declarations/tool-declarations';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

export const OPACITY_DEFAULT = 0.65;
export const SQUARE_SIZE_DEFAULT = 40;
export const FACTOR_SQUARE_SIZE = 5;

@Injectable({
    providedIn: 'root',
})
export class GridService extends Tool {
    readonly type: ToolType;

    color: string;
    isActive: boolean;
    opacity: number;
    squareSize: number;

    constructor(protected canvasService: CanvasService) {
        super({} as DrawingService);
        this.type = ToolType.Grid;
        this.opacity = OPACITY_DEFAULT;
        this.isActive = false;
        this.squareSize = SQUARE_SIZE_DEFAULT;
        this.color = '#717171';
    }

    stopDrawing(): void {
        this.opacity = OPACITY_DEFAULT;
        this.isActive = false;
        this.squareSize = SQUARE_SIZE_DEFAULT;
    }

    drawGrid(): void {
        this.canvasService.cleanGrid();
        if (!this.isActive) return;

        this.canvasService.gridCtx.strokeStyle = this.color;
        this.canvasService.gridCtx.globalAlpha = this.opacity;

        this.canvasService.gridCtx.beginPath();

        const arrayX = this.calculateArray(this.canvasService.width);
        for (const pointX of arrayX) {
            this.canvasService.gridCtx.moveTo(pointX, 0);
            this.canvasService.gridCtx.lineTo(pointX, this.canvasService.height);
        }

        const arrayY = this.calculateArray(this.canvasService.height);
        for (const pointY of arrayY) {
            this.canvasService.gridCtx.moveTo(0, pointY);
            this.canvasService.gridCtx.lineTo(this.canvasService.width, pointY);
        }

        this.canvasService.gridCtx.stroke();
    }

    private calculateArray(length: number): number[] {
        let position = 0;
        const array = new Array();
        for (let i = 0; position <= length; i++) {
            array[i] = position;
            position += this.squareSize;
        }
        return array;
    }

    increaseSquareSize(): void {
        this.squareSize += FACTOR_SQUARE_SIZE;
        if (this.squareSize > MAX_SQUARE_SIZE) this.squareSize = MAX_SQUARE_SIZE;

        this.drawGrid();
    }

    decreaseSquareSize(): void {
        this.squareSize -= FACTOR_SQUARE_SIZE;
        if (this.squareSize < MIN_SQUARE_SIZE) this.squareSize = MIN_SQUARE_SIZE;

        this.drawGrid();
    }
}
