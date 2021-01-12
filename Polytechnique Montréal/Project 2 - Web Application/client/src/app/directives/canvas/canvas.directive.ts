import { AfterViewInit, Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';

@Directive({
    selector: '[appCanvas]',
})
export class CanvasDirective implements OnInit, AfterViewInit {
    constructor(private elem: ElementRef<HTMLCanvasElement>, private renderer: Renderer2, private toolSelectService: ToolSelectNotifierService) {}
    private canvas: ElementRef<HTMLCanvasElement>;

    ngOnInit(): void {
        this.canvas = this.elem;
    }

    ngAfterViewInit(): void {
        this.addCanvasListeners();
    }

    addCanvasListeners(): void {
        this.renderer.listen(this.canvas.nativeElement, 'pointerdown', (event: PointerEvent) => {
            this.canvas.nativeElement.setPointerCapture(event.pointerId);
            this.toolSelectService.currentTool.onMouseDown(event);
        });
        this.renderer.listen(this.canvas.nativeElement, 'pointerup', (event: PointerEvent) => {
            this.canvas.nativeElement.releasePointerCapture(event.pointerId);
            this.toolSelectService.currentTool.onMouseUp(event);
        });
        this.renderer.listen(this.canvas.nativeElement, 'pointermove', (event: PointerEvent) => {
            this.toolSelectService.currentTool.onMouseMove(event);
        });
        this.renderer.listen(this.canvas.nativeElement, 'pointerout', (event: PointerEvent) => {
            this.toolSelectService.currentTool.onMouseOut(event);
        });
        this.renderer.listen(this.canvas.nativeElement, 'click', (event: MouseEvent) => {
            this.toolSelectService.currentTool.onMouseClick(event);
        });
        this.renderer.listen(this.canvas.nativeElement, 'dblclick', (event: MouseEvent) => {
            this.toolSelectService.currentTool.onMouseDoubleClick(event);
        });
        this.renderer.listen(this.canvas.nativeElement, 'wheel', (event: WheelEvent) => {
            event.preventDefault();
            this.toolSelectService.currentTool.onWheelScroll(event);
        });
        this.renderer.listen(this.canvas.nativeElement, 'contextmenu', (event: MouseEvent) => {
            event.preventDefault();
        });
    }
}
