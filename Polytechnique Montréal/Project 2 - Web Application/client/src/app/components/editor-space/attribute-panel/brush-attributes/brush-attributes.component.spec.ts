import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColorPalette } from '@app/classes/color/color';
import { MaterialModule } from '@app/material.module';
import { BrushService, TextureType } from '@app/services/tools/base-trace/brush/brush-service';
import { ColorService } from '@app/services/tools/color/color.service';
import { of } from 'rxjs';
import { BrushAttributesComponent } from './brush-attributes.component';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('BrushAttributesComponent', () => {
    let component: BrushAttributesComponent;
    let fixture: ComponentFixture<BrushAttributesComponent>;
    const componentTitle = 'Pinceau';

    let brushService: jasmine.SpyObj<BrushService>;
    let colorService: jasmine.SpyObj<ColorService>;
    let subscribeToColorObservableSpy: jasmine.Spy;

    // tslint:disable:no-magic-numbers
    const colorPaletteStub: ColorPalette = { lastTenColors: [], primaryColor: '', secondaryColor: '', selectedColor: '#ccddee' };
    beforeEach(async(() => {
        brushService = jasmine.createSpyObj('BrushService', ['setWidth', 'getTexture', 'setTexture', 'setColor']);
        brushService.texture = TextureType.BlackShadow;
        brushService.width = 10;

        colorService = jasmine.createSpyObj('ColorService', ['getColorsObservable']);
        subscribeToColorObservableSpy = colorService.getColorsObservable.and.returnValue(of(colorPaletteStub));
        TestBed.configureTestingModule({
            declarations: [BrushAttributesComponent],
            providers: [
                { provide: BrushService, useValue: brushService },
                { provide: ColorService, useValue: colorService },
            ],
            imports: [MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrushAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Pinceau"', () => {
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

    it('should set brush color after subscribing to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(brushService.color).toBe(colorPaletteStub.selectedColor);
    });

    it('should get all brush attributes after component initialized from brush service', () => {
        // Arrange

        // Act
        component.ngOnInit();

        // Assert
        expect(component.strokeWidth).toBe(brushService.width);
        expect(component.selectedTexture).toBe(brushService.texture);
    });

    it('should set brush strokeWidth on #widthChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 2 };

        // Act
        component.widthChanged(event);

        // Assert
        expect(brushService.width).toBe(2);
    });

    it('should update #strokeWidth on #widthChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 3 };

        // Act
        component.widthChanged(event);
        // Assert
        expect(component.strokeWidth).toBe(3);
    });

    it('should set brush texture on #textureChanged', () => {
        // Arrange
        const radio: any = {};
        const event = { source: radio, value: 'Linear' };

        // Act
        component.textureChanged(event);
        // Assert
        expect(component.selectedTexture).toBe('Linear');
    });

    it('should update #selectedTexture on #textureChanged', () => {
        // Arrange
        const radio: any = {};
        const event = { source: radio, value: 'Shadow' };

        // Act
        component.textureChanged(event);
        // Assert
        expect(component.selectedTexture).toBe('Shadow');
    });

    // extra front end tests

    it('should call #widthChanged after width slider input event ', () => {
        // Arrange
        spyOn(component, 'widthChanged');
        const componentDebug = fixture.debugElement;
        const slider = componentDebug.query(By.css('#widthSlider'));

        // Act
        slider.triggerEventHandler('input', { value: 100 });

        // Assert
        expect(component.widthChanged).toHaveBeenCalledTimes(1);
    });

    it('should call #textureChanged after radio button change event ', () => {
        // Arrange
        spyOn(component, 'textureChanged');
        const componentDebug = fixture.debugElement;
        const slider = componentDebug.query(By.css('#textureRadio'));

        // Act
        slider.triggerEventHandler('change', { value: 'Fractal' });

        // Assert
        expect(component.textureChanged).toHaveBeenCalledTimes(1);
    });
});
