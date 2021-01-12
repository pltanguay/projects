import { Injectable } from '@angular/core';
import { Spray } from '@app/classes/base-trace/spray/spray';
import {
    DEFAULT_DROPLET_WIDTH,
    DEFAULT_POINTS_PER_SPLASH,
    DEFAULT_SPLASH_WIDTH,
    DEFAULT_TOOL_FREQUENCY,
    MILLISECONDS_1000,
} from '@app/classes/tool/tool';
import { Point } from '@app/classes/utils/point';
import { MouseButton } from '@app/declarations/mouse.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BaseTraceService } from '@app/services/tools/base-trace/base-trace.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

@Injectable({
    providedIn: 'root',
})
export class SprayService extends BaseTraceService {
    frequency: number;
    widthSplash: number;
    nPointsPerSplash: number;
    private interval: ReturnType<typeof setTimeout>;
    readonly type: ToolType;

    constructor(drawingService: DrawingService, snapshotFactory: SnapshotFactoryService) {
        super(drawingService, snapshotFactory);
        this.type = ToolType.Spray;
        this.width = DEFAULT_DROPLET_WIDTH;
        this.frequency = DEFAULT_TOOL_FREQUENCY;
        this.widthSplash = DEFAULT_SPLASH_WIDTH;
        this.nPointsPerSplash = DEFAULT_POINTS_PER_SPLASH;
        this.newTrace();
    }

    onMouseDown(event: PointerEvent): void {
        if (event.button !== MouseButton.Left) return;
        this.mouseDown = true;
        this.isProcessing = true;
        this.newTrace();
        this.mousePosition = this.getPositionFromMouse(event);
        this.interval = this.startInterval() as ReturnType<typeof setTimeout>;
    }

    onMouseMove(event: PointerEvent): void {
        this.mousePosition = this.getPositionFromMouse(event);
    }

    onMouseUp(event: MouseEvent): void {
        super.onMouseUp(event);
        this.stopInterval();
    }

    protected newTrace(): void {
        this.currentTrace = new Spray(this.width, this.color);
    }

    private startInterval(): null | ReturnType<typeof setTimeout> {
        return setInterval(this.functionDrawSplash.bind(this), this.calculateSplashPeriod());
    }

    private calculateSplashPeriod(): number {
        return (1 / this.frequency) * MILLISECONDS_1000;
    }

    private functionDrawSplash(): void {
        this.drawingService.cleanPreview();
        for (let i = 0; i < this.nPointsPerSplash; i++) {
            const randomPosition = this.calculateRandomPosition();
            this.currentTrace.addPoint(randomPosition);
        }
        this.drawingService.drawPreview(this.currentTrace);
    }

    private stopInterval(): void {
        clearInterval(this.interval as ReturnType<typeof setTimeout>);
    }

    private calculateRandomPosition(): Point {
        const centerX = this.mousePosition.x;
        const centerY = this.mousePosition.y;

        const offset = this.getRandomOffset();
        const x = centerX + offset.x;
        const y = centerY + offset.y;

        return new Point(x, y);
    }

    private getRandomOffset(): Point {
        const randomAngle = Math.random() * 2 * Math.PI;

        // On additionne deux moitiés de facteur aléatoire pour permettre une meilleure distibution de points dans le splash
        let randomRadius = (Math.random() * this.widthSplash) / 2;
        randomRadius += (Math.random() * this.widthSplash) / 2;

        return new Point(Math.cos(randomAngle) * randomRadius, Math.sin(randomAngle) * randomRadius);
    }
}
