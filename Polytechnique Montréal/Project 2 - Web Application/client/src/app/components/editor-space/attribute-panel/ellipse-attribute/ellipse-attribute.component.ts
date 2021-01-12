import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { ColorPalette } from '@app/classes/color/color';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_WIDTH_ELLIPSE, MIN_WIDTH_ELLIPSE } from '@app/declarations/sliders-edges';
import { ColorService } from '@app/services/tools/color/color.service';
import { EllipseService } from '@app/services/tools/contour-shape/ellipse/ellipse.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-ellipse-attribute',
    templateUrl: './ellipse-attribute.component.html',
    styleUrls: ['./ellipse-attribute.component.scss', '../attribute-panel.component.scss'],
})
export class EllipseAttributeComponent extends AbsAttributeDirective implements OnInit, OnDestroy {
    isWithBorder: boolean;
    isWithFill: boolean;
    title: string;
    width: number | null;
    primaryColor: string;
    secondaryColor: string;

    private colorsSubscription: Subscription;

    constructor(private ellipseService: EllipseService, private colorService: ColorService) {
        super();
        this.title = 'Ellipse';
    }

    ngOnInit(): void {
        this.setWidth();
        this.setIsWithBorder();
        this.setIsWithFill();
        this.subscribeToColors();
        this.minWidth = MIN_WIDTH_ELLIPSE;
        this.maxWidth = MAX_WIDTH_ELLIPSE;
    }

    ngOnDestroy(): void {
        this.colorsSubscription.unsubscribe();
    }

    withBorderToggled(event: MatSlideToggleChange): void {
        this.isWithBorder = event.checked;
        this.ellipseService.withBorder = this.isWithBorder;
        if (!this.isWithBorder && !this.isWithFill) {
            this.isWithFill = !event.checked;
            this.ellipseService.withFill = this.isWithFill;
        }
    }

    withFillToggled(event: MatSlideToggleChange): void {
        this.isWithFill = event.checked;
        this.ellipseService.withFill = this.isWithFill;
        if (!this.isWithBorder && !this.isWithFill) {
            this.isWithBorder = !event.checked;
            this.ellipseService.withBorder = this.isWithBorder;
        }
    }

    widthChanged(event: MatSliderChange): void {
        this.width = event.value as number;
        this.ellipseService.width = this.width;
    }

    private setWidth(): void {
        this.width = this.ellipseService.width;
    }
    private setIsWithBorder(): void {
        this.isWithBorder = this.ellipseService.withBorder;
    }
    private setIsWithFill(): void {
        this.isWithFill = this.ellipseService.withFill;
    }

    private subscribeToColors(): void {
        this.colorsSubscription = this.colorService.getColorsObservable().subscribe((colors: ColorPalette) => {
            this.ellipseService.fillColor = colors.primaryColor;
            this.ellipseService.strokeColor = colors.secondaryColor;
        });
    }
}
