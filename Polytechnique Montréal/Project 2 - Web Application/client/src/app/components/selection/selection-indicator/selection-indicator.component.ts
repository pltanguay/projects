import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { MouseData } from '@app/classes/interfaces/mousedata';
import { Vec2 } from '@app/classes/interfaces/vec2';

export const INDICATOR_ID = 'indicator';

@Component({
    selector: 'app-selection-indicator',
    templateUrl: './selection-indicator.component.html',
    styleUrls: ['./selection-indicator.component.scss'],
})
export class SelectionIndicatorComponent implements AfterViewInit {
    readonly INDICATOR_ID: string = INDICATOR_ID;
    resizeMouseDataEmit: MouseData;

    private shifIsClicked: boolean;
    private mouseDown: boolean;
    private last: Vec2;

    @Input() positionClass: string;

    @Output() resizeChange: EventEmitter<MouseData> = new EventEmitter<MouseData>();
    @Output() isDragged: EventEmitter<string> = new EventEmitter<string>();
    @Output() mouseIsUp: EventEmitter<void> = new EventEmitter<void>();
    @Output() mouseIsDown: EventEmitter<void> = new EventEmitter<void>();
    @Output() shiftIsReleased: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('selectionIndicator') selectionIndicator: ElementRef<HTMLDivElement>;

    constructor(private renderer: Renderer2) {
        this.mouseDown = false;
        this.INDICATOR_ID = INDICATOR_ID;
    }

    ngAfterViewInit(): void {
        this.addMouseListeners();
    }

    addMouseListeners(): void {
        this.renderer.listen(this.selectionIndicator.nativeElement, 'pointerdown', (event: PointerEvent) => {
            this.selectionIndicator.nativeElement.setPointerCapture(event.pointerId);
            this.last = { x: event.clientX, y: event.clientY };
            this.mouseDown = true;
            this.mouseIsDown.emit();
        });
        this.renderer.listen(this.selectionIndicator.nativeElement, 'pointerup', (event: PointerEvent) => {
            this.selectionIndicator.nativeElement.releasePointerCapture(event.pointerId);
            this.mouseDown = false;
            this.mouseIsUp.emit();
        });
        this.renderer.listen(this.selectionIndicator.nativeElement, 'pointermove', (event: PointerEvent) => {
            if (this.mouseDown) {
                const isPressed = event.shiftKey;
                if (this.shifIsClicked && !isPressed) {
                    this.last = { x: event.clientX, y: event.clientY };
                    this.shiftIsReleased.emit();
                }
                this.shifIsClicked = isPressed;
                this.isDragged.emit(INDICATOR_ID);
                this.emitMousePositionMovement(event);
            }
        });
    }

    emitMousePositionMovement(event: MouseEvent): void {
        if (this.mouseDown) {
            this.resizeMouseDataEmit = { mouseX: event.clientX - this.last.x, mouseY: event.clientY - this.last.y, isShift: event.shiftKey };
            this.resizeChange.emit(this.resizeMouseDataEmit);
        }
    }
}
