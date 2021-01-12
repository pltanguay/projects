import { Injectable } from '@angular/core';
import { MouseData } from '@app/classes/interfaces/mousedata';
import { CanvasService, MIN_CANVAS_SIZE } from '@app/services/canvas/canvas.service';
import { GridService } from '@app/services/tools/grid-service/grid.service';
import { Size } from '@app/services/workspace/workspace.service';
import { Observable, Subject } from 'rxjs';
export const MAX_RESIZE_LIMIT_RATIO = 0.99;
@Injectable({
    providedIn: 'root',
})
export class ResizeService {
    width: number;
    height: number;
    size: Subject<Size>;

    constructor(private baseCanvasService: CanvasService, private gridService: GridService) {
        this.size = new Subject();
    }

    resize(): void {
        this.size.next({ width: this.width, height: this.height });
        this.baseCanvasService.storeImageData();
        this.baseCanvasService.setSize(this.width, this.height);
        this.baseCanvasService.restoreImageData();
        this.gridService.drawGrid();
    }

    getSize(): Observable<Size> {
        return this.size.asObservable();
    }

    updateWidthSize(event: MouseData): void {
        const widthPosition = event.mouseX - this.baseCanvasService.getOffsetLeft();
        this.width = Math.max(MIN_CANVAS_SIZE, widthPosition);
    }

    updateHeightSize(event: MouseData): void {
        const heightPosition = event.mouseY;
        this.height = Math.max(MIN_CANVAS_SIZE, heightPosition);
    }
}
