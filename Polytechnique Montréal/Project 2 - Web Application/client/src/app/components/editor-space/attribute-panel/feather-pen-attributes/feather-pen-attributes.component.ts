import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { DEFAULT_FEATHER_PEN_WIDTH } from '@app/classes/base-trace/feather-pen/calligraphy/calligraphy';
import { ColorPalette } from '@app/classes/color/color';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_ANGLE_FEATHERPEN, MAX_WIDTH_FEATHERPEN, MIN_ANGLE_FEATHERPEN, MIN_WIDTH_FEATHERPEN } from '@app/declarations/sliders-edges';
import { FeatherPenService } from '@app/services/tools/base-trace/feather-pen/feather-pen.service';
import { ColorService } from '@app/services/tools/color/color.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-feather-pen-attributes',
    templateUrl: './feather-pen-attributes.component.html',
    styleUrls: ['./feather-pen-attributes.component.scss', '../attribute-panel.component.scss'],
})
export class FeatherPenAttributesComponent extends AbsAttributeDirective implements OnInit, OnDestroy {
    title: string;
    width: number;
    angle: number;

    private colorsSubscription: Subscription;
    private angleSubscription: Subscription;

    constructor(private featherPenService: FeatherPenService, private colorService: ColorService) {
        super();
        this.subscribeToColor();
        this.subscribeToAngle();
    }

    ngOnInit(): void {
        this.initialiseValues();
        this.setEdgeAttributes();
    }

    ngOnDestroy(): void {
        this.colorsSubscription.unsubscribe();
        this.angleSubscription.unsubscribe();
    }

    private initialiseValues(): void {
        this.title = 'Plume';
        this.angle = this.featherPenService.angle = 0;
        this.width = this.featherPenService.width = DEFAULT_FEATHER_PEN_WIDTH;
    }

    onWidthChange(event: MatSliderChange): void {
        this.width = event.value as number;
        this.featherPenService.width = this.width;
    }

    onAngleChange(event: MatSliderChange): void {
        this.angle = event.value as number;
        this.featherPenService.angle = this.angle;
    }

    private setEdgeAttributes(): void {
        this.minWidth = MIN_WIDTH_FEATHERPEN;
        this.maxWidth = MAX_WIDTH_FEATHERPEN;
        this.minAngle = MIN_ANGLE_FEATHERPEN;
        this.maxAngle = MAX_ANGLE_FEATHERPEN;
    }

    private subscribeToColor(): void {
        this.colorsSubscription = this.colorService.getColorsObservable().subscribe((colors: ColorPalette) => {
            this.featherPenService.color = colors.selectedColor;
        });
    }

    private subscribeToAngle(): void {
        this.angleSubscription = this.featherPenService.getAngleObservable().subscribe((updatedAngle: number) => {
            this.angle = updatedAngle;
        });
    }
}
