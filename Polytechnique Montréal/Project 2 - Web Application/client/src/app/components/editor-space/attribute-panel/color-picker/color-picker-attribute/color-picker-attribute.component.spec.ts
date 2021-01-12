import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { ColorPickerAttributeComponent } from './color-picker-attribute.component';

// tslint:disable:no-string-literal

describe('ColorPickerAttributeComponent', () => {
    let component: ColorPickerAttributeComponent;
    let fixture: ComponentFixture<ColorPickerAttributeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPickerAttributeComponent],
            imports: [MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerAttributeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#applyBorderColor should return an object with the color of the middle pixel', () => {
        // Arrange
        const middlePixel = 'rgba(255, 0, 0, 1)';
        component.colorPicker.middlePixel = middlePixel;
        const expectedResult: object = {
            border: `2.5px solid ${middlePixel}`,
            display: 'block',
        };

        // Act
        const newBorder = component.applyBorderColor();

        // Assert
        expect(newBorder).toEqual(expectedResult);
    });
});
