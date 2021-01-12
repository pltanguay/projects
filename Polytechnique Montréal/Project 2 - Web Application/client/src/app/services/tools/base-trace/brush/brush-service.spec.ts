import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService, TextureType } from './brush-service';

// tslint:disable:no-string-literal
describe('BrushService', () => {
    let service: BrushService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase', 'pushData']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(BrushService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' #updateFilter should return filter none for #texture Shadow', () => {
        // Arrange
        service.texture = TextureType.Shadow;

        // Act
        service['updateFilter']();

        // Assert
        expect(service['filter']).toEqual('none');
    });

    it(' #updateFilter should return filter blur(4px) for #texture Blur', () => {
        // Arrange
        service.texture = TextureType.Blur;

        // Act
        service['updateFilter']();

        // Assert
        expect(service['filter']).toEqual('blur(4px)');
    });

    it(' #updateFilter should return filter url(#blackShadow) for #texture Black Shadow', () => {
        // Arrange
        service.texture = TextureType.BlackShadow;

        // Act
        service['updateFilter']();

        // Assert
        expect(service['filter']).toEqual('url(#blackShadow)');
    });

    it(' #updateFilter should return filter url(#linear) for #texture Linear', () => {
        // Arrange
        service.texture = TextureType.Linear;

        // Act
        service['updateFilter']();

        // Assert
        expect(service['filter']).toEqual('url(#linear)');
    });

    it(' #updateFilter should return filter url(#dots) for #texture Dots', () => {
        // Arrange
        service.texture = TextureType.Dots;

        // Act
        service['updateFilter']();

        // Assert
        expect(service['filter']).toEqual('url(#dots)');
    });

    it(' #updateFilter should return filter url(#fractal) for #texture Fractal', () => {
        // Arrange
        service.texture = TextureType.Fractal;

        // Act
        service['updateFilter']();

        // Assert
        expect(service['filter']).toEqual('url(#fractal)');
    });
});
