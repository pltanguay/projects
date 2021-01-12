import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Color, ColorPalette } from '@app/classes/color/color';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_TOLERANCE_BUCKET, MIN_TOLERANCE_BUCKET } from '@app/declarations/sliders-edges';
import { BucketService, DEFAULT_TOLERANCE } from '@app/services/tools/bucket/bucket.service';
import { ColorService } from '@app/services/tools/color/color.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-bucket-attributes',
    templateUrl: './bucket-attributes.component.html',
    styleUrls: ['./bucket-attributes.component.scss', '../attribute-panel.component.scss'],
})
export class BucketAttributesComponent extends AbsAttributeDirective implements OnInit {
    title: string;
    tolerance: number;
    colorsSubscription: Subscription;

    constructor(private bucketService: BucketService, private colorService: ColorService) {
        super();
        this.title = 'Sceau de peinture';
        this.tolerance = DEFAULT_TOLERANCE;
    }

    ngOnInit(): void {
        this.subscribeToColor();
        this.setTolerance();
        this.maxTolerance = MAX_TOLERANCE_BUCKET;
        this.minTolerance = MIN_TOLERANCE_BUCKET;
    }

    toleranceChanged(event: MatSliderChange): void {
        this.tolerance = event.value as number;
        this.bucketService.tolerance = this.tolerance;
    }

    private subscribeToColor(): void {
        this.colorsSubscription = this.colorService.getColorsObservable().subscribe((colors: ColorPalette) => {
            const colorAttributes = new Color().rgbaToColorAttributes(colors.selectedColor);
            this.bucketService.fillColor = new Color(colorAttributes);
        });
    }

    private setTolerance(): void {
        this.tolerance = this.bucketService.tolerance;
    }
}
