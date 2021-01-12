import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { MouseData } from '@app/classes/interfaces/mousedata';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';

export const INDICATOR_ID = 'indicator';
@Component({
    selector: 'app-resize-indicator',
    templateUrl: './resize-indicator.component.html',
    styleUrls: ['./resize-indicator.component.scss'],
})
export class ResizeIndicatorComponent implements AfterViewInit {
    readonly INDICATOR_ID: string;
    private mouseDown: boolean;

    @Input() positionClass: string;

    @Output() resizeChange: EventEmitter<MouseData> = new EventEmitter<MouseData>();
    @Output() isDragged: EventEmitter<void> = new EventEmitter<void>();
    @Output() isReleased: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('resizeIndicator') resizeIndicator: ElementRef<HTMLDivElement>;

    constructor(private renderer: Renderer2, private drawingService: DrawingService, private toolSelectService: ToolSelectNotifierService) {
        this.mouseDown = false;
        this.INDICATOR_ID = INDICATOR_ID;
    }

    ngAfterViewInit(): void {
        this.addMouseListeners();
    }

    private addMouseListeners(): void {
        this.renderer.listen(this.resizeIndicator.nativeElement, 'pointerdown', (event: PointerEvent) => {
            this.resizeIndicator.nativeElement.setPointerCapture(event.pointerId);
            this.mouseDown = true;
        });
        this.renderer.listen(this.resizeIndicator.nativeElement, 'pointerup', (event: PointerEvent) => {
            this.resizeIndicator.nativeElement.releasePointerCapture(event.pointerId);
            this.mouseDown = false;
            this.isReleased.emit();
        });
        this.renderer.listen(this.resizeIndicator.nativeElement, 'pointermove', (event: PointerEvent) => {
            if (this.toolSelectService.isToolPreviewCleanable()) this.drawingService.cleanPreview();
            if (this.mouseDown) {
                this.isDragged.emit();
                this.emitMousePositionMovement(event);
            }
        });
    }

    private emitMousePositionMovement(event: MouseEvent): void {
        if (this.mouseDown) {
            const resizeMouseDataEmit = { mouseX: event.clientX, mouseY: event.clientY };
            this.resizeChange.emit(resizeMouseDataEmit);
        }
    }
}
