import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPalette } from '@app/classes/color/color';
import { MaterialModule } from '@app/material.module';
import { SprayService } from '@app/services/tools/base-trace/spray/spray.service';
import { ColorService } from '@app/services/tools/color/color.service';
import { of } from 'rxjs';
import { SprayAttributesComponent } from './spray-attributes.component';

// tslint:disable:no-magic-numbers
// tslint:disable:no-any
// tslint:disable:no-string-literal
const colorPaletteStub: ColorPalette = { lastTenColors: [], primaryColor: '', secondaryColor: '', selectedColor: '#ccddee' };
describe('SprayAttributesComponent', () => {
    let component: SprayAttributesComponent;
    let fixture: ComponentFixture<SprayAttributesComponent>;
    const componentTitle = 'Aérosol';

    let sprayService: jasmine.SpyObj<SprayService>;
    let colorService: jasmine.SpyObj<ColorService>;
    let subscribeToColorObservableSpy: jasmine.Spy;

    beforeEach(async(() => {
        sprayService = jasmine.createSpyObj('SprayService', ['']);
        sprayService.frequency = 15;
        sprayService.width = 10;
        sprayService.widthSplash = 10;
        sprayService.nPointsPerSplash = 10;

        colorService = jasmine.createSpyObj('ColorService', ['getColorsObservable']);
        subscribeToColorObservableSpy = colorService.getColorsObservable.and.returnValue(of(colorPaletteStub));

        TestBed.configureTestingModule({
            declarations: [SprayAttributesComponent],
            providers: [
                { provide: SprayService, useValue: sprayService },
                { provide: ColorService, useValue: colorService },
            ],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprayAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Aérosol"', () => {
        // Arrange
        const title = fixture.nativeElement.querySelector('.title');

        // Act

        // Assert
        expect(title.textContent).toBe(componentTitle);
    });

    it('should subscribe to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(subscribeToColorObservableSpy).toHaveBeenCalled();
    });

    it('#ngOnInit should call #subscribeToColor() and #setAttributes()', () => {
        // Arrange
        const spyColor = spyOn<any>(component, 'subscribeToColor');
        const spyAttributes = spyOn<any>(component, 'setAttributes');

        // Act
        component.ngOnInit();

        // Assert
        expect(spyColor).toHaveBeenCalled();
        expect(spyAttributes).toHaveBeenCalled();
    });

    it('#pointsPerSplashChanged should set spray #nPointsPerSplash in component and spray service', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 2 };

        // Act
        component.pointsPerSplashChanged(event);

        // Assert
        expect(sprayService.nPointsPerSplash).toBe(2);
        expect(component.nPointsPerSplash).toBe(2);
    });

    it('#frequencyChanged should set spray #frequency in component and spray service', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 10 };

        // Act
        component.frequencyChanged(event);

        // Assert
        expect(sprayService.frequency).toBe(10);
        expect(component.frequency).toBe(10);
    });

    it('#frequencyChanged should set spray #frequency at 1 if value is 0', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 0 };

        // Act
        component.frequencyChanged(event);

        // Assert
        expect(sprayService.frequency).toBe(1);
        expect(component.frequency).toBe(1);
    });

    it('#widthSplashChanged should set spray #widthSplash in component and spray service', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 20 };

        // Act
        component.widthSplashChanged(event);

        // Assert
        expect(sprayService.widthSplash).toBe(20);
        expect(component.widthSplash).toBe(20);
    });

    it('#widthDropletsChanged should set spray #widthDroplets in component and spray service', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 15 };

        // Act
        component.widthDropletsChanged(event);

        // Assert
        expect(sprayService.width).toBe(15);
        expect(component.widthDroplets).toBe(15);
    });
});
