import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CanvasService } from '@app/services/canvas/canvas.service';

@Component({
    selector: 'app-grid-canvas',
    templateUrl: './grid-canvas.component.html',
    styleUrls: ['./grid-canvas.component.scss'],
})
export class GridCanvasComponent implements AfterViewInit {
    @Input() hasEraser: boolean;

    @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

    constructor(private canvasService: CanvasService) {}

    ngAfterViewInit(): void {
        this.canvasService.createGrid(this.canvas);
    }
}
