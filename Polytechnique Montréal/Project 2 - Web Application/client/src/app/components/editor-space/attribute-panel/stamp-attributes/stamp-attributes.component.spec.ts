import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { StampService } from '@app/services/tools/stamp/stamp.service';
import { of } from 'rxjs';
import { StampAttributesComponent } from './stamp-attributes.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-magic-numbers
describe('StampAttributesComponent', () => {
    let component: StampAttributesComponent;
    let fixture: ComponentFixture<StampAttributesComponent>;
    const componentTitle = 'Étampe';

    let subscribeToAngleObservableSpy: jasmine.Spy;
    let stampServiceSpy: jasmine.SpyObj<StampService>;

    beforeEach(async(() => {
        stampServiceSpy = jasmine.createSpyObj('StampServiceSpy', ['getAngleObservable', 'resetValues', 'clearStampPreview', 'updateStampPreview']);
        stampServiceSpy.angle = 15;
        stampServiceSpy.scaleFactor = 2;

        subscribeToAngleObservableSpy = stampServiceSpy.getAngleObservable.and.returnValue(of(12));

        TestBed.configureTestingModule({
            declarations: [StampAttributesComponent],
            providers: [{ provide: StampService, useValue: stampServiceSpy }],
            imports: [NoopAnimationsModule, MaterialModule, MatMenuModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StampAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Étampe"', () => {
        // Arrange
        const title = fixture.nativeElement.querySelector('.title');

        // Act

        // Assert
        expect(title.textContent).toBe(componentTitle);
    });

    it('#ngOnInit should call #subscribeToAngle,, #initialiseValues, #setAttributes and #setEdgeAttributes', () => {
        // Arrange
        const spyAttributes = spyOn<any>(component, 'setAttributes');
        const spyEdgeAttributes = spyOn<any>(component, 'setEdgeAttributes');
        const spyInit = spyOn<any>(component, 'initialiseValues');
        const spyAngle = spyOn<any>(component, 'subscribeToAngle');

        // Act
        component.ngOnInit();

        // Assert
        expect(spyAttributes).toHaveBeenCalled();
        expect(spyInit).toHaveBeenCalled();
        expect(spyAngle).toHaveBeenCalled();
        expect(spyEdgeAttributes).toHaveBeenCalled();
    });

    it('#angleChanged should set stamp #angle in component and stamp service', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 20 };

        // Act
        component.angleChanged(event);

        // Assert
        expect(stampServiceSpy.angle).toBe(20);
        expect(component.angle).toBe(20);
        expect(stampServiceSpy.updateStampPreview).toHaveBeenCalled();
    });

    it('#scaleFactorChanged should set stamp #scaleFactor in component and stamp service', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 30 };

        // Act
        component.scaleFactorChanged(event);

        // Assert
        expect(stampServiceSpy.scaleFactor).toBe(30);
        expect(component.stampService.scaleFactor).toBe(30);
        expect(stampServiceSpy.updateStampPreview).toHaveBeenCalled();
    });

    it('#stampChanged should set stamp #stampURL and #isURLDefault in component and stamp service, and call #resetValues', () => {
        // Arrange
        const url = 'test';
        const spyResetValues = spyOn<any>(component, 'resetValues');

        // Act
        component.stampChanged(url);

        // Assert
        expect(stampServiceSpy.stampURL).toBe('test');
        expect(component.stampURL).toBe('test');
        expect(stampServiceSpy.isURLDefault).toBe(false);
        expect(component.isURLDefault).toBe(false);
        expect(spyResetValues).toHaveBeenCalled();
        expect(stampServiceSpy.updateStampPreview).toHaveBeenCalled();
    });

    it('#subscribeToAngle should subscribe to angle service', () => {
        // Arrange
        spyOn<any>(component, 'subscribeToAngle');

        // Act
        component.subscribeToAngle();

        // Assert
        expect(subscribeToAngleObservableSpy).toHaveBeenCalled();
    });

    it('#resetValues should should call #resetValue from service, set angle and scale factor', () => {
        // Arrange
        stampServiceSpy.angle = 20;
        stampServiceSpy.scaleFactor = 3;

        // Act
        component['resetValues']();

        // Assert
        expect(stampServiceSpy.resetValues).toHaveBeenCalled();
        expect(stampServiceSpy.angle).toEqual(20);
        expect(stampServiceSpy.scaleFactor).toEqual(3);
    });
});
