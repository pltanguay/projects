import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/material.module';
import { EraserService } from '@app/services/tools/base-trace/eraser/eraser.service';
import { EraserAttributesComponent } from './eraser-attributes.component';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('EraserAttributesComponent', () => {
    let component: EraserAttributesComponent;
    let fixture: ComponentFixture<EraserAttributesComponent>;
    const componentTitle = 'Efface';
    let eraserService: jasmine.SpyObj<EraserService>;
    // tslint:disable:no-magic-numbers
    beforeEach(async(() => {
        eraserService = jasmine.createSpyObj('EraserService', ['']);
        eraserService.width = 40;

        TestBed.configureTestingModule({
            declarations: [EraserAttributesComponent],
            providers: [{ provide: EraserService, useValue: eraserService }],
            imports: [MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EraserAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Efface"', () => {
        // Arrange
        const title = fixture.nativeElement.querySelector('.title');

        // Act

        // Assert
        expect(title.textContent).toBe(componentTitle);
    });

    it('should get eraser #width from eraser service', () => {
        // Arrange

        // Act
        component['setWidth']();

        // Assert
        expect(component.width).toBe(eraserService.width);
    });

    it('should get all eraser attributes after component initialized from eraser service', () => {
        // Arrange

        // Act
        component.ngOnInit();

        // Assert
        expect(component.width).toBe(eraserService.width);
    });

    it('should set eraser width on #widthChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 79 };

        // Act
        component.widthChanged(event);

        // Assert
        expect(eraserService.width).toBe(79);
    });

    it('should update #width on #widthChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 87 };

        // Act
        component.widthChanged(event);
        // Assert
        expect(component.width).toBe(87);
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
