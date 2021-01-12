import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { ColorPalette } from '@app/classes/color/color';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_SIDES_POLYGONE, MAX_WIDTH_POLYGONE, MIN_SIDES_POLYGONE, MIN_WIDTH_POLYGONE } from '@app/declarations/sliders-edges';
import { ColorService } from '@app/services/tools/color/color.service';
import { PolygoneService } from '@app/services/tools/contour-shape/polygone/polygone.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-polygone-attribute',
    templateUrl: './polygone-attribute.component.html',
    styleUrls: ['./polygone-attribute.component.scss', '../attribute-panel.component.scss'],
})
export class PolygoneAttributeComponent extends AbsAttributeDirective implements OnInit, OnDestroy {
    isWithBorder: boolean;
    isWithFill: boolean;
    title: string;
    width: number | null;
    primaryColor: string;
    secondaryColor: string;
    numberOfSides: number;

    private colorsSubscription: Subscription;

    constructor(private polygoneService: PolygoneService, private colorService: ColorService) {
        super();
        this.title = 'Polygone';
    }

    ngOnInit(): void {
        this.setWidth();
        this.setIsWithBorder();
        this.setIsWithFill();
        this.subscribeToColor();
        this.setNumberOfSides();
        this.setEdgeAttributes();
    }

    ngOnDestroy(): void {
        this.colorsSubscription.unsubscribe();
    }

    withBorderToggled(event: MatSlideToggleChange): void {
        this.isWithBorder = event.checked;
        this.polygoneService.withBorder = this.isWithBorder;
        if (!this.isWithBorder && !this.isWithFill) {
            this.isWithFill = !event.checked;
            this.polygoneService.withFill = this.isWithFill;
        }
    }

    withFillToggled(event: MatSlideToggleChange): void {
        this.isWithFill = event.checked;
        this.polygoneService.withFill = this.isWithFill;
        if (!this.isWithBorder && !this.isWithFill) {
            this.isWithBorder = !event.checked;
            this.polygoneService.withBorder = this.isWithBorder;
        }
    }

    widthChanged(event: MatSliderChange): void {
        this.width = event.value as number;
        this.polygoneService.width = this.width;
    }

    numberOfSidesChanged(event: MatSliderChange): void {
        this.numberOfSides = event.value as number;
        this.polygoneService.numberOfSides = this.numberOfSides;
    }

    private setEdgeAttributes(): void {
        this.minWidth = MIN_WIDTH_POLYGONE;
        this.maxWidth = MAX_WIDTH_POLYGONE;
        this.minSides = MIN_SIDES_POLYGONE;
        this.maxSides = MAX_SIDES_POLYGONE;
    }

    private subscribeToColor(): void {
        this.colorsSubscription = this.colorService.getColorsObservable().subscribe((colors: ColorPalette) => {
            this.polygoneService.fillColor = colors.primaryColor;
            this.polygoneService.strokeColor = colors.secondaryColor;
        });
    }

    private setWidth(): void {
        this.width = this.polygoneService.width;
    }

    private setIsWithBorder(): void {
        this.isWithBorder = this.polygoneService.withBorder;
    }

    private setIsWithFill(): void {
        this.isWithFill = this.polygoneService.withFill;
    }

    private setNumberOfSides(): void {
        this.numberOfSides = this.polygoneService.numberOfSides;
    }
}
