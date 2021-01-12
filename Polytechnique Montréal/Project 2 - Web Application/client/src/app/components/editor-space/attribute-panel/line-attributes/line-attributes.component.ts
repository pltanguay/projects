import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_WIDTH_LINE, MIN_WIDTH_LINE } from '@app/declarations/sliders-edges';
import { ColorService } from '@app/services/tools/color/color.service';
import { LineService } from '@app/services/tools/line/line.service';
import { Subscription } from 'rxjs';

const MAX_RADIUS = 200;
const MIN_RADIUS = 1;
@Component({
    selector: 'app-line-attributes',
    templateUrl: './line-attributes.component.html',
    styleUrls: ['./line-attributes.component.scss', '../attribute-panel.component.scss'],
})
export class LineAttributesComponent extends AbsAttributeDirective implements OnInit, OnDestroy {
    minRadius: number;
    maxRadius: number;
    isWithJunctions: boolean;
    lineWidth: number | null;
    junctionRadius: number | null;
    title: string;

    colorsSubscription: Subscription;

    constructor(private lineService: LineService, private colorService: ColorService) {
        super();
        this.title = 'Ligne';
        this.minRadius = MIN_RADIUS;
        this.maxRadius = MAX_RADIUS;
    }

    ngOnInit(): void {
        this.setJunctionType();
        this.setLineWidth();
        this.setRadius();
        this.subscribeToColor();
        this.minWidth = MIN_WIDTH_LINE;
        this.maxWidth = MAX_WIDTH_LINE;
    }

    ngOnDestroy(): void {
        this.colorsSubscription.unsubscribe();
    }

    withJunctionsToggled(event: MatSlideToggleChange): void {
        this.isWithJunctions = event.checked;
        this.lineService.withJunctions = this.isWithJunctions;
    }

    widthChanged(event: MatSliderChange): void {
        this.lineWidth = event.value as number;
        this.validateRadius(this.lineWidth);
        this.lineService.width = this.lineWidth;
    }
    junctionRadiusChanged(event: MatSliderChange): void {
        this.junctionRadius = event.value as number;
        this.lineService.radius = this.junctionRadius;
    }

    private validateRadius(value: number): void {
        this.minRadius = Math.round(value / 2);
        this.junctionRadius = this.minRadius;
        this.lineService.radius = this.minRadius;
    }

    private subscribeToColor(): void {
        this.colorsSubscription = this.colorService.getColorsObservable().subscribe((colors) => {
            this.lineService.color = colors.selectedColor;
        });
    }

    private setJunctionType(): void {
        this.isWithJunctions = this.lineService.withJunctions;
    }

    private setLineWidth(): void {
        this.lineWidth = this.lineService.width;
    }

    private setRadius(): void {
        this.junctionRadius = this.lineService.radius;
    }
}
