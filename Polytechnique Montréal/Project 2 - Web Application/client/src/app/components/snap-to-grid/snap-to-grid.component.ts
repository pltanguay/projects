import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SnapDirection, SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
export const GREEN_FILL = '#69f0ae';
export const NOT_SELECTED_FILL = '#edf2f4';
export const DEFAULT_INDEX = 0;
export const INDICATOR_SELECTOR_CLASS = '.circle circle';
@Component({
    selector: 'app-snap-to-grid',
    templateUrl: './snap-to-grid.component.html',
    styleUrls: ['./snap-to-grid.component.scss'],
})
export class SnapToGridComponent implements OnInit, AfterViewInit {
    isSnapToActive: boolean;
    @ViewChild('defaultIndicator') defaultIndicator: ElementRef<SVGElement>;
    private currentIndicatorIndex: number;

    constructor(public snapToGridService: SnapToGridService, public renderer: Renderer2, private element: ElementRef) {
        this.isSnapToActive = this.snapToGridService.active;
    }

    ngAfterViewInit(): void {
        if (!this.snapToGridService.snapIndicator) this.snapToGridService.snapIndicator = DEFAULT_INDEX;

        this.currentIndicatorIndex = this.snapToGridService.snapIndicator;
        this.renderer.setAttribute(this.currentIndicator, 'fill', GREEN_FILL);
    }

    ngOnInit(): void {
        this.isSnapToActive = this.snapToGridService.active;
    }

    snapToGridToggle(event: MatSlideToggleChange): void {
        this.snapToGridService.active = event.checked;
    }

    indicatorClick(indicator: number): void {
        this.renderer.setAttribute(this.currentIndicator, 'fill', NOT_SELECTED_FILL);
        this.currentIndicatorIndex = this.snapToGridService.snapIndicator = indicator;
        this.renderer.setAttribute(this.currentIndicator, 'fill', GREEN_FILL);
    }

    topLeft(): void {
        this.snapToGridService.snapDirection = SnapDirection.TopLeft;
    }
    topCenter(): void {
        this.snapToGridService.snapDirection = SnapDirection.TopCenter;
    }
    topRight(): void {
        this.snapToGridService.snapDirection = SnapDirection.TopRight;
    }
    centerLeft(): void {
        this.snapToGridService.snapDirection = SnapDirection.CenterLeft;
    }
    center(): void {
        this.snapToGridService.snapDirection = SnapDirection.Center;
    }
    centerRight(): void {
        this.snapToGridService.snapDirection = SnapDirection.CenterRight;
    }
    bottomLeft(): void {
        this.snapToGridService.snapDirection = SnapDirection.BottomLeft;
    }
    bottomCenter(): void {
        this.snapToGridService.snapDirection = SnapDirection.BottomCenter;
    }
    bottomRight(): void {
        this.snapToGridService.snapDirection = SnapDirection.BottomRight;
    }

    get currentIndicator(): SVGElement {
        return this.element.nativeElement.querySelectorAll(INDICATOR_SELECTOR_CLASS)[this.currentIndicatorIndex];
    }
}
