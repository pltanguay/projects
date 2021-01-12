import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CanvasService } from '@app/services/canvas/canvas.service';

@Component({
    selector: 'app-preview-canvas',
    templateUrl: './preview-canvas.component.html',
    styleUrls: ['./preview-canvas.component.scss'],
})
export class PreviewCanvasComponent implements AfterViewInit {
    private context: CanvasRenderingContext2D;
    @Input() width: number;
    @Input() height: number;
    @Input() hasEraser: boolean;

    @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

    constructor(private canvaseService: CanvasService) {}
    ngAfterViewInit(): void {
        this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.canvaseService.previewCtx = this.context;
    }
}
