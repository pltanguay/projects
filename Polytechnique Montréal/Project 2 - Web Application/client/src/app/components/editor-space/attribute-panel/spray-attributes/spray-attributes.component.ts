import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ColorPalette } from '@app/classes/color/color';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import {
    MAX_FREQUENCY_SPRAY,
    MAX_POINTS_PER_SPLASH,
    MAX_WIDTH_DROPLETS,
    MAX_WIDTH_SPLASH,
    MIN_FREQUENCY_SPRAY,
    MIN_POINTS_PER_SPLASH,
    MIN_WIDTH_DROPLETS,
    MIN_WIDTH_SPLASH,
} from '@app/declarations/sliders-edges';
import { SprayService } from '@app/services/tools/base-trace/spray/spray.service';
import { ColorService } from '@app/services/tools/color/color.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-spray-attributes',
    templateUrl: './spray-attributes.component.html',
    styleUrls: ['./spray-attributes.component.scss', '../attribute-panel.component.scss'],
})
export class SprayAttributesComponent extends AbsAttributeDirective implements OnInit, OnDestroy {
    title: string;
    nPointsPerSplash: number;
    frequency: number;
    widthSplash: number;
    widthDroplets: number;
    colorsSubscription: Subscription;

    constructor(private sprayService: SprayService, private colorService: ColorService) {
        super();
        this.title = 'Aérosol';
    }

    ngOnInit(): void {
        this.subscribeToColor();
        this.setAttributes();
        this.setEdgeAttributes();
    }

    ngOnDestroy(): void {
        this.colorsSubscription.unsubscribe();
    }

    pointsPerSplashChanged(event: MatSliderChange): void {
        this.nPointsPerSplash = event.value as number;
        this.sprayService.nPointsPerSplash = event.value as number;
    }

    frequencyChanged(event: MatSliderChange): void {
        let value = event.value;
        if (value === 0) value = 1;
        this.frequency = value as number;
        this.sprayService.frequency = value as number;
    }

    widthSplashChanged(event: MatSliderChange): void {
        this.widthSplash = event.value as number;
        this.sprayService.widthSplash = event.value as number;
    }

    widthDropletsChanged(event: MatSliderChange): void {
        this.widthDroplets = event.value as number;
        this.sprayService.width = event.value as number;
    }

    private subscribeToColor(): void {
        this.colorsSubscription = this.colorService.getColorsObservable().subscribe((colors: ColorPalette) => {
            this.sprayService.color = colors.selectedColor;
        });
    }

    private setAttributes(): void {
        this.frequency = this.sprayService.frequency;
        this.widthSplash = this.sprayService.widthSplash;
        this.widthDroplets = this.sprayService.width;
        this.nPointsPerSplash = this.sprayService.nPointsPerSplash;
    }

    private setEdgeAttributes(): void {
        this.minPointsPerSplash = MIN_POINTS_PER_SPLASH;
        this.maxPointsPerSplash = MAX_POINTS_PER_SPLASH;
        this.minFrequency = MIN_FREQUENCY_SPRAY;
        this.maxFrequency = MAX_FREQUENCY_SPRAY;
        this.minSplashWidth = MIN_WIDTH_SPLASH;
        this.maxSplashWidth = MAX_WIDTH_SPLASH;
        this.minDropletWidth = MIN_WIDTH_DROPLETS;
        this.maxDropletWidth = MAX_WIDTH_DROPLETS;
    }
}
