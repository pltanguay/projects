import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColorPalette } from '@app/classes/color/color';
import { MaterialModule } from '@app/material.module';
import { PencilService } from '@app/services/tools/base-trace/pencil/pencil-service';
import { ColorService } from '@app/services/tools/color/color.service';
import { of } from 'rxjs';
import { PencilAttributesComponent } from './pencil-attributes.component';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('PencilAttributesComponent', () => {
    let component: PencilAttributesComponent;
    let fixture: ComponentFixture<PencilAttributesComponent>;
    const componentTitle = 'Crayon';
    let pencilService: jasmine.SpyObj<PencilService>;
    let colorService: jasmine.SpyObj<ColorService>;
    let subscribeToColorObservableSpy: jasmine.Spy;

    // tslint:disable:no-magic-numbers
    const colorPaletteStub: ColorPalette = { lastTenColors: [], primaryColor: '', secondaryColor: '', selectedColor: '#ffffff' };
    beforeEach(async(() => {
        pencilService = jasmine.createSpyObj('PencilService', ['setWidth', 'setColor']);
        pencilService.width = 40;

        colorService = jasmine.createSpyObj('ColorService', ['getColorsObservable']);
        subscribeToColorObservableSpy = colorService.getColorsObservable.and.returnValue(of(colorPaletteStub));
        TestBed.configureTestingModule({
            declarations: [PencilAttributesComponent],
            providers: [
                { provide: PencilService, useValue: pencilService },
                { provide: ColorService, useValue: colorService },
            ],
            imports: [MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Crayon"', () => {
        // Arrange
        const title = fixture.nativeElement.querySelector('.title');

        // Act

        // Assert
        expect(title.textContent).toBe(componentTitle);
    });

    it('should get pencil #width from pencil service', () => {
        // Arrange

        // Act
        component['setWidth']();

        // Assert
        expect(component.width).toBe(pencilService.width);
    });

    it('should subscribe to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(subscribeToColorObservableSpy).toHaveBeenCalled();
    });

    it('should set pencil color after subscribing to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(pencilService.color).toBe(colorPaletteStub.selectedColor);
    });

    it('should get all pencil attributes after component initialized from pencil service', () => {
        // Arrange

        // Act
        component.ngOnInit();

        // Assert
        expect(component.width).toBe(pencilService.width);
    });

    it('should set pencil width on #widthChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 99 };

        // Act
        component.widthChanged(event);

        // Assert
        expect(pencilService.width).toBe(99);
    });

    it('should update #width on #widthChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 78 };

        // Act
        component.widthChanged(event);
        // Assert
        expect(component.width).toBe(78);
    });

    // extra front end tests

    it('should call #widthChanged after width slider input event ', () => {
        // Arrange
        spyOn(component, 'widthChanged');
        const componentDebug = fixture.debugElement;
        const slider = componentDebug.query(By.css('#widthSlider'));

        // Act
        slider.triggerEventHandler('input', { value: 10 });

        // Assert
        expect(component.widthChanged).toHaveBeenCalledTimes(1);
    });
});
