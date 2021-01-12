import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { ColorPalette } from '@app/classes/color/color';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_WIDTH_RECTANGLE, MIN_WIDTH_RECTANGLE } from '@app/declarations/sliders-edges';
import { ColorService } from '@app/services/tools/color/color.service';
import { RectangleService } from '@app/services/tools/contour-shape/rectangle/rectangle.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-rectangle-attribute',
    templateUrl: './rectangle-attribute.component.html',
    styleUrls: ['./rectangle-attribute.component.scss', '../attribute-panel.component.scss'],
})
export class RectangleAttributeComponent extends AbsAttributeDirective implements OnInit, OnDestroy {
    isWithBorder: boolean;
    isWithFill: boolean;
    title: string;
    width: number | null;
    private colorsSubscription: Subscription;

    constructor(private rectangleService: RectangleService, private colorService: ColorService) {
        super();
        this.title = 'Rectangle';
    }

    ngOnInit(): void {
        this.setWidth();
        this.setIsWithBorder();
        this.setIsWithFill();
        this.subscribeToColor();
        this.minWidth = MIN_WIDTH_RECTANGLE;
        this.maxWidth = MAX_WIDTH_RECTANGLE;
    }

    ngOnDestroy(): void {
        this.colorsSubscription.unsubscribe();
    }

    withBorderToggled(event: MatSlideToggleChange): void {
        this.isWithBorder = event.checked;
        this.rectangleService.withBorder = this.isWithBorder;
        if (!this.isWithBorder && !this.isWithFill) {
            this.isWithFill = !event.checked;
            this.rectangleService.withFill = this.isWithFill;
        }
    }

    withFillToggled(event: MatSlideToggleChange): void {
        this.isWithFill = event.checked;
        this.rectangleService.withFill = this.isWithFill;
        if (!this.isWithBorder && !this.isWithFill) {
            this.isWithBorder = !event.checked;
            this.rectangleService.withBorder = this.isWithBorder;
        }
    }
    widthChanged(event: MatSliderChange): void {
        this.width = event.value as number;
        this.rectangleService.width = this.width;
    }

    private subscribeToColor(): void {
        this.colorsSubscription = this.colorService.getColorsObservable().subscribe((colors: ColorPalette) => {
            this.rectangleService.fillColor = colors.primaryColor;
            this.rectangleService.strokeColor = colors.secondaryColor;
        });
    }

    private setWidth(): void {
        this.width = this.rectangleService.width;
    }

    private setIsWithBorder(): void {
        this.isWithBorder = this.rectangleService.withBorder;
    }

    private setIsWithFill(): void {
        this.isWithFill = this.rectangleService.withFill;
    }
}
