import { Directive } from '@angular/core';

@Directive({
    selector: '[appAbsAttribute]',
})
export class AbsAttributeDirective {
    minWidth: number;
    maxWidth: number;

    minTolerance?: number;
    maxTolerance?: number;

    minSides: number;
    maxSides: number;

    minPointsPerSplash?: number;
    maxPointsPerSplash?: number;
    minFrequency?: number;
    maxFrequency?: number;
    minSplashWidth?: number;
    maxSplashWidth?: number;
    minDropletWidth?: number;
    maxDropletWidth?: number;

    minAngle?: number;
    maxAngle?: number;

    minScaleFactor?: number;
    maxScaleFactor?: number;
}
