import { Component } from '@angular/core';
import { Dimension } from '@app/classes/interfaces/dimension';
import { MouseData } from '@app/classes/interfaces/mousedata';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { BoundingBoxService, State } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
@Component({
    selector: 'app-control-point',
    templateUrl: './control-point.component.html',
    styleUrls: ['./control-point.component.scss'],
})
export class ControlPointComponent {
    private boxHeight: number;
    private boxWidth: number;
    private state: State;

    constructor(private boundingBox: BoundingBoxService, private toolService: ToolSelectNotifierService) {}

    updateState(): void {
        this.state = {
            center: { x: this.boundingBox.center.x, y: this.boundingBox.center.y },
            dimension: { width: this.boundingBox.absDimension.width, height: this.boundingBox.absDimension.height },
        };
        this.boxHeight = this.state.dimension.height;
        this.boxWidth = this.state.dimension.width;
    }

    scale(event: MouseData, sx: number, sy: number): void {
        sx = event.isShift ? 2 * sx : sx;
        sy = event.isShift ? 2 * sy : sy;
        const result = this.getUpdatedValues(event, sx, sy);
        const center = result[0];
        const dimension = result[1];

        this.updateBoundingBox(center, dimension);

        const scale = this.getScale(dimension);

        if (scale.x === 0 || scale.y === 0) {
            return;
        }
        const scaleAxisOffset = this.getScaleAxisOffset(sx, sy, event.isShift);

        (this.toolService.currentTool as SelectionService).scale(scale.x, scale.y, scaleAxisOffset.x, scaleAxisOffset.y, this.state.center);
        this.boxWidth = dimension.width;
        this.boxHeight = dimension.height;
    }

    private getUpdatedValues(event: MouseData, sx: number, sy: number): [Vec2, Dimension] {
        const center = { x: this.state.center.x, y: this.state.center.y };
        const dimension = { width: this.state.dimension.width, height: this.state.dimension.height };
        center.x += (Math.abs(sx) * event.mouseX) / 2;
        center.y += (Math.abs(sy) * event.mouseY) / 2;
        dimension.width += sx * event.mouseX;
        dimension.height += sy * event.mouseY;
        return [center, dimension];
    }

    private updateBoundingBox(newCenter: Vec2, newDimension: Dimension): void {
        this.boundingBox.left = newCenter.x - Math.abs(newDimension.width) / 2;
        this.boundingBox.top = newCenter.y - Math.abs(newDimension.height) / 2;
        this.boundingBox.dimension = { width: newDimension.width, height: newDimension.height };
    }

    private getScale(dimension: Dimension): Vec2 {
        const scale = {
            x: dimension.width / (this.boxWidth === 0 ? 1 : this.boxWidth),
            y: dimension.height / (this.boxHeight === 0 ? 1 : this.boxHeight),
        };
        return scale;
    }

    private getScaleAxisOffset(sx: number, sy: number, isShift?: boolean): Vec2 {
        return { x: isShift ? 0 : (-sx * this.state.dimension.width) / 2, y: isShift ? 0 : (-sy * this.state.dimension.height) / 2 };
    }
}
