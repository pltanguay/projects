import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule } from '@angular/material/slider';
import { By } from '@angular/platform-browser';
import { Color } from '@app/classes/color/color';
import { MaterialModule } from '@app/material.module';
import { BucketService } from '@app/services/tools/bucket/bucket.service';
import { BucketAttributesComponent } from './bucket-attributes.component';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('BucketAttributesComponent', () => {
    let component: BucketAttributesComponent;
    let fixture: ComponentFixture<BucketAttributesComponent>;
    const componentTitle = 'Sceau de peinture';
    let bucketService: jasmine.SpyObj<BucketService>;

    // tslint:disable:no-magic-numbers
    beforeEach(async(() => {
        bucketService = jasmine.createSpyObj('BucketService', ['']);
        bucketService.tolerance = 10;
        bucketService.fillColor = new Color({
            red: '00',
            green: '00',
            blue: '00',
            opacity: 1,
        });

        TestBed.configureTestingModule({
            declarations: [BucketAttributesComponent],
            providers: [{ provide: BucketService, useValue: bucketService }],

            imports: [MatSliderModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BucketAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Sceau de peinture"', () => {
        // Arrange
        const title = fixture.nativeElement.querySelector('.title');

        // Act

        // Assert
        expect(title.textContent).toBe(componentTitle);
    });

    it('should set line #tolerance from bucket service', () => {
        // Arrange

        // Act
        component['setTolerance']();

        // Assert
        expect(component.tolerance).toBe(bucketService.tolerance);
    });

    it('should set all bucket attributes after component initialized from bucket service', () => {
        // Arrange

        // Act
        component.ngOnInit();

        // Assert
        expect(component.tolerance).toBe(bucketService.tolerance);
    });

    it('should set bucket tolerance on #toleranceChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 40 };

        // Act
        component.toleranceChanged(event);

        // Assert
        expect(bucketService.tolerance).toBe(40);
    });

    it('should update #tolerance on #toleranceChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 30 };

        // Act
        component.toleranceChanged(event);
        // Assert
        expect(component.tolerance).toBe(30);
    });

    it('should call #toleranceChanged after width slider "input" event ', () => {
        // Arrange
        spyOn(component, 'toleranceChanged');
        const componentDebug = fixture.debugElement;
        const slider = componentDebug.query(By.css('#toleranceSlider'));

        // Act
        slider.triggerEventHandler('input', { value: 10 });

        // Assert
        expect(component.toleranceChanged).toHaveBeenCalledTimes(1);
    });
});
