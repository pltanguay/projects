import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appSgvFilters]',
})
export class SgvFiltersDirective implements AfterViewInit {
    SVG_NS: string = 'http://www.w3.org/2000/svg';

    private container: ElementRef<HTMLElement>;

    constructor(private renderer: Renderer2, elem: ElementRef) {
        this.container = elem;
    }

    ngAfterViewInit(): void {
        this.generateFilters();
    }

    private generateFilters(): void {
        this.generateFilterBlackShadow(this.renderer);
        this.generateFilterLinear(this.renderer);
        this.generateFilterDots(this.renderer);
        this.generateFilterFractal(this.renderer);
    }

    private generateFilterBlackShadow(renderer: Renderer2): void {
        const svgFilterEl: SVGFilterElement = renderer.createElement('filter', this.SVG_NS);
        renderer.setAttribute(svgFilterEl, 'id', 'blackShadow');
        renderer.setAttribute(svgFilterEl, 'filterUnits', 'userSpaceOnUse');

        const feGaussianBlurSvgEl: SVGFEGaussianBlurElement = renderer.createElement('feGaussianBlur', this.SVG_NS);
        renderer.setAttribute(feGaussianBlurSvgEl, 'in', 'SourceAlpha');
        renderer.setAttribute(feGaussianBlurSvgEl, 'stdDeviation', '4');
        renderer.setAttribute(feGaussianBlurSvgEl, 'result', 'blur');
        renderer.appendChild(svgFilterEl, feGaussianBlurSvgEl);

        const feOffset: SVGFEOffsetElement = renderer.createElement('feOffset', this.SVG_NS);
        renderer.setAttribute(feOffset, 'in', 'blur');
        renderer.setAttribute(feOffset, 'dx', '4');
        renderer.setAttribute(feOffset, 'dy', '4');
        renderer.setAttribute(feOffset, 'result', 'offsetBlur');
        renderer.appendChild(svgFilterEl, feOffset);

        const feSpecularLighting: SVGFESpecularLightingElement = renderer.createElement('feSpecularLighting', this.SVG_NS);
        renderer.setAttribute(feSpecularLighting, 'in', 'blur');
        renderer.setAttribute(feSpecularLighting, 'surfaceScale', '5');
        renderer.setAttribute(feSpecularLighting, 'specularConstant', '.75');
        renderer.setAttribute(feSpecularLighting, 'specularExponent', '20');
        renderer.setAttribute(feSpecularLighting, 'result', 'specOut');
        renderer.appendChild(svgFilterEl, feSpecularLighting);

        const feComposite: SVGFECompositeElement = renderer.createElement('feComposite', this.SVG_NS);
        renderer.setAttribute(feComposite, 'in', 'SourceGraphic');
        renderer.setAttribute(feComposite, 'in2', 'specOut');
        renderer.setAttribute(feComposite, 'operator', 'arithmetic');
        renderer.setAttribute(feComposite, 'result', 'specOut');
        renderer.setAttribute(feComposite, 'k1', '0');
        renderer.setAttribute(feComposite, 'k2', '1');
        renderer.setAttribute(feComposite, 'k3', '1');
        renderer.setAttribute(feComposite, 'k4', '0');
        renderer.setAttribute(feComposite, 'result', 'litPaint');
        renderer.appendChild(svgFilterEl, feComposite);

        const feMerge: SVGFEMergeElement = renderer.createElement('feMerge', this.SVG_NS);

        const feMergeNode1: SVGFEMergeNodeElement = renderer.createElement('feMergeNode', this.SVG_NS);
        renderer.setAttribute(feMergeNode1, 'in', 'offsetBlur');
        renderer.appendChild(feMerge, feMergeNode1);

        const feMergeNode2: SVGFEMergeNodeElement = renderer.createElement('feMergeNode', this.SVG_NS);
        renderer.setAttribute(feMergeNode2, 'in', 'litPaint');
        renderer.appendChild(feMerge, feMergeNode2);
        renderer.appendChild(svgFilterEl, feMerge);

        renderer.appendChild(this.container.nativeElement, svgFilterEl);
    }

    private generateFilterLinear(renderer: Renderer2): void {
        const svgFilterEl: SVGFilterElement = renderer.createElement('filter', this.SVG_NS);
        renderer.setAttribute(svgFilterEl, 'id', 'linear');
        renderer.setAttribute(svgFilterEl, 'filterUnits', 'userSpaceOnUse');
        renderer.setAttribute(svgFilterEl, 'x', '0%');
        renderer.setAttribute(svgFilterEl, 'y', '0%');

        const svgFeTurbulence: SVGFETurbulenceElement = renderer.createElement('feTurbulence', this.SVG_NS);
        renderer.setAttribute(svgFeTurbulence, 'baseFrequency', '0.01 0.4');
        renderer.setAttribute(svgFeTurbulence, 'numOctaves', '2');
        renderer.setAttribute(svgFeTurbulence, 'result', 'NOISE');
        renderer.appendChild(svgFilterEl, svgFeTurbulence);

        const svgDisplacementMap: SVGFEDisplacementMapElement = renderer.createElement('feDisplacementMap', this.SVG_NS);
        renderer.setAttribute(svgDisplacementMap, 'in', 'SourceGraphic');
        renderer.setAttribute(svgDisplacementMap, 'in2', 'NOISE');
        renderer.setAttribute(svgDisplacementMap, 'scale', '20');
        renderer.setAttribute(svgDisplacementMap, 'xChannelSelector', 'R');
        renderer.setAttribute(svgDisplacementMap, 'yChannelSelector', 'R');
        renderer.appendChild(svgFilterEl, svgDisplacementMap);

        renderer.appendChild(this.container.nativeElement, svgFilterEl);
    }

    private generateFilterDots(renderer: Renderer2): void {
        const filterSvgEl: SVGFilterElement = renderer.createElement('filter', this.SVG_NS);
        renderer.setAttribute(filterSvgEl, 'id', 'dots');
        renderer.setAttribute(filterSvgEl, 'filterUnits', 'userSpaceOnUse');

        const feTurbulenceSvgEl: SVGFETurbulenceElement = renderer.createElement('feTurbulence', this.SVG_NS);
        renderer.setAttribute(feTurbulenceSvgEl, 'baseFrequency', '0.7');
        renderer.appendChild(filterSvgEl, feTurbulenceSvgEl);

        const feDisplacementMapSvgEl: SVGFEDisplacementMapElement = renderer.createElement('feDisplacementMap', this.SVG_NS);
        renderer.setAttribute(feDisplacementMapSvgEl, 'in', 'SourceGraphic');
        renderer.setAttribute(feDisplacementMapSvgEl, 'scale', '20');
        renderer.appendChild(filterSvgEl, feDisplacementMapSvgEl);

        renderer.appendChild(this.container.nativeElement, filterSvgEl);
    }
    private generateFilterFractal(renderer: Renderer2): void {
        const svgFilterEl: SVGFilterElement = renderer.createElement('filter', this.SVG_NS);
        renderer.setAttribute(svgFilterEl, 'id', 'fractal');
        renderer.setAttribute(svgFilterEl, 'filterUnits', 'userSpaceOnUse');

        const svgFeTurbulence: SVGFETurbulenceElement = renderer.createElement('feTurbulence', this.SVG_NS);
        renderer.setAttribute(svgFeTurbulence, 'type', 'turbulence');
        renderer.setAttribute(svgFeTurbulence, 'baseFrequency', '0.05');
        renderer.setAttribute(svgFeTurbulence, 'numOctaves', '2');
        renderer.setAttribute(svgFeTurbulence, 'result', 'turbulence');
        renderer.appendChild(svgFilterEl, svgFeTurbulence);

        const svgDisplacementMap: SVGFEDisplacementMapElement = renderer.createElement('feDisplacementMap', this.SVG_NS);
        renderer.setAttribute(svgDisplacementMap, 'in2', 'turbulence');
        renderer.setAttribute(svgDisplacementMap, 'in', 'SourceGraphic');
        renderer.setAttribute(svgDisplacementMap, 'scale', '50');
        renderer.setAttribute(svgDisplacementMap, 'xChannelSelector', 'R');
        renderer.setAttribute(svgDisplacementMap, 'yChannelSelector', 'G');
        renderer.appendChild(svgFilterEl, svgDisplacementMap);

        renderer.appendChild(this.container.nativeElement, svgFilterEl);
    }
}
