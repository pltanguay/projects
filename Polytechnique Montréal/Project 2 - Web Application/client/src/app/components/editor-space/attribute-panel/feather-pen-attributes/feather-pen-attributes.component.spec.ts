import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { FeatherPenService } from '@app/services/tools/base-trace/feather-pen/feather-pen.service';
import { ColorService } from '@app/services/tools/color/color.service';
import { FeatherPenAttributesComponent } from './feather-pen-attributes.component';

describe('FeatherPenAttributesComponent', () => {
    let component: FeatherPenAttributesComponent;
    let fixture: ComponentFixture<FeatherPenAttributesComponent>;
    let featherPenService: jasmine.SpyObj<FeatherPenService>;
    let colorService: jasmine.SpyObj<ColorService>;

    beforeEach(async(() => {
        featherPenService = jasmine.createSpyObj('FeatherPenService', ['']);
        colorService = jasmine.createSpyObj('ColorService', ['']);

        TestBed.configureTestingModule({
            declarations: [FeatherPenAttributesComponent],
            imports: [NoopAnimationsModule, MaterialModule],
            providers: [
                { provider: FeatherPenService, useValue: featherPenService },
                { provider: ColorService, useValue: colorService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeatherPenAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onWidthChange should update #width', () => {
        // Arrange
        const output = 30;
        const event = { value: output } as MatSliderChange;

        // Act
        component.onWidthChange(event);

        // Assert
        expect(component.width).toBe(output);
    });

    it('#onAngleChange should update #angle', () => {
        // Arrange
        const output = 30;
        const event = { value: output } as MatSliderChange;

        // Act
        component.onAngleChange(event);

        // Assert
        expect(component.angle).toBe(output);
    });
});
