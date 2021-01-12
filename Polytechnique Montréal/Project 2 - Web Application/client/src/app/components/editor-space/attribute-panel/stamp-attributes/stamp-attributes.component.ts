import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { STAMP_DEFAULT_CANVAS_SIZE } from '@app/classes/tool/tool';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_ANGLE_STAMP, MAX_SCALE_STAMP, MIN_ANGLE_STAMP, MIN_SCALE_STAMP } from '@app/declarations/sliders-edges';
import { URLS_EMOJIS, URLS_OTHERS } from '@app/declarations/stamps-urls';
import { StampService } from '@app/services/tools/stamp/stamp.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-stamp-attributes',
    templateUrl: './stamp-attributes.component.html',
    styleUrls: ['./stamp-attributes.component.scss', '../attribute-panel.component.scss'],
})
export class StampAttributesComponent extends AbsAttributeDirective implements OnInit, OnDestroy {
    title: string;
    angle: number;
    stampURL: string;
    urlsOthers: string[];
    urlsEmojis: string[];
    isURLDefault: boolean;

    private angleSubscription: Subscription;

    constructor(public stampService: StampService) {
        super();
    }

    ngOnInit(): void {
        this.initialiseValues();
        this.subscribeToAngle();
        this.setAttributes();
        this.setEdgeAttributes();
    }

    ngOnDestroy(): void {
        this.angleSubscription.unsubscribe();
        this.stampService.clearStampPreview();
    }

    angleChanged(event: MatSliderChange): void {
        this.angle = this.stampService.angle = event.value as number;
        this.stampService.updateStampPreview();
    }

    scaleFactorChanged(event: MatSliderChange): void {
        this.stampService.scaleFactor = event.value as number;
        this.stampService.updateStampPreview();
    }

    stampChanged(stampURL: string): void {
        this.stampURL = this.stampService.stampURL = stampURL as string;
        this.isURLDefault = this.stampService.isURLDefault = false;
        this.resetValues();
        this.stampService.updateStampPreview();
    }

    subscribeToAngle(): void {
        this.angleSubscription = this.stampService.getAngleObservable().subscribe((updatedAngle: number) => {
            this.angle = updatedAngle;
        });
    }

    private resetValues(): void {
        this.stampService.resetValues();
        this.angle = this.stampService.angle;
        this.stampService.svgSize = { width: STAMP_DEFAULT_CANVAS_SIZE, height: STAMP_DEFAULT_CANVAS_SIZE };
    }

    private setAttributes(): void {
        this.angle = this.stampService.angle;
        this.isURLDefault = this.stampService.isURLDefault;
    }

    private setEdgeAttributes(): void {
        this.maxAngle = MAX_ANGLE_STAMP;
        this.minAngle = MIN_ANGLE_STAMP;
        this.maxScaleFactor = MAX_SCALE_STAMP;
        this.minScaleFactor = MIN_SCALE_STAMP;
    }

    private initialiseValues(): void {
        this.title = 'Étampe';
        this.urlsOthers = URLS_OTHERS;
        this.urlsEmojis = URLS_EMOJIS;
    }
}
