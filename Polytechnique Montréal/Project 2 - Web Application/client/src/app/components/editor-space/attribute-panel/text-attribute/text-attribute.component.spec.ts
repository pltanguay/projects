import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPalette } from '@app/classes/color/color';
import { TextAttributeComponent } from '@app/components/editor-space/attribute-panel/text-attribute/text-attribute.component';
import { MaterialModule } from '@app/material.module';
import { ColorService } from '@app/services/tools/color/color.service';
import { POLICE, TextService } from '@app/services/tools/text/text.service';
import { of } from 'rxjs';

// tslint:disable:no-magic-numbers
// tslint:disable:no-any
const colorPaletteStub: ColorPalette = { lastTenColors: [], primaryColor: '', secondaryColor: '', selectedColor: '#ccddee' };
describe('TextAttributesComponent', () => {
    let component: TextAttributeComponent;
    let fixture: ComponentFixture<TextAttributeComponent>;
    const componentTitle = 'Texte';

    let textService: jasmine.SpyObj<TextService>;
    let colorService: jasmine.SpyObj<ColorService>;
    let colorsObservableSpy: jasmine.Spy;

    beforeEach(async(() => {
        textService = jasmine.createSpyObj('TextService', ['drawPreviewText', 'getEventObservable']);
        textService.getEventObservable.and.returnValue(of(true));

        colorService = jasmine.createSpyObj('ColorService', ['getColorsObservable']);
        colorsObservableSpy = colorService.getColorsObservable.and.returnValue(of(colorPaletteStub));

        TestBed.configureTestingModule({
            declarations: [TextAttributeComponent],
            providers: [
                { provide: TextService, useValue: textService },
                { provide: ColorService, useValue: colorService },
            ],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
        textService.attribute = { size: 40, police: POLICE[0], isBold: false, isItalic: false, align: 'left', color: 'black' };
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextAttributeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Texte"', () => {
        // Arrange
        const title = fixture.nativeElement.querySelector('.title');

        // Act

        // Assert
        expect(title.textContent).toBe(componentTitle);
    });

    it('should subscribe to color service', () => {
        // Arrange

        // Act
        component.subscribeToColor();

        // Assert
        expect(colorsObservableSpy).toHaveBeenCalled();
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

    it('#updatePreview should update the text that we are currently drawing', () => {
        // Arrange
        textService.isProcessing = true;

        // Act
        component.updatePreview();

        // Assert
        expect(textService.drawPreviewText).toHaveBeenCalled();
    });

    it('#activateInput should set the disable value to false', () => {
        // Arrange

        // Act
        component.activateInput();

        // Assert
        expect(component.shouldDisableInput).toBe(false);
    });

    it('#sizeChanged should set text #size in component and text service', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 2 };
        const spyUpdatePreview = spyOn<any>(component, 'updatePreview');

        // Act
        component.sizeChanged(event);

        // Assert
        expect(textService.attribute.size).toBe(2);
        expect(component.size).toBe(2);
        expect(spyUpdatePreview).toHaveBeenCalled();
    });

    it('#policeChanged should set text #selectedPolice in component and text service', () => {
        // Arrange
        const radio: any = {};
        const event = { source: radio, value: POLICE[1] };
        const spyUpdatePreview = spyOn<any>(component, 'updatePreview');

        // Act
        component.policeChanged(event);
        // Assert
        expect(textService.attribute.police).toBe('Brush Script MT');
        expect(component.selectedPolice).toBe('Brush Script MT');
        expect(spyUpdatePreview).toHaveBeenCalled();
    });

    it('#boldToggled should inverse text #isBold in component and text service', () => {
        // Arrange
        textService.attribute.isBold = true;
        const spyUpdatePreview = spyOn<any>(component, 'updatePreview');
        const spyButtonStyle = spyOn<any>(component, 'setButtonStyle');

        // Act
        component.boldToggled();

        // Assert
        expect(textService.attribute.isBold).toBe(false);
        expect(component.isBold).toBe(false);
        expect(spyUpdatePreview).toHaveBeenCalled();
        expect(spyButtonStyle).toHaveBeenCalled();
    });

    it('#italicToggled should inverse text #isItalic in component and text service', () => {
        // Arrange
        textService.attribute.isItalic = true;
        const spyUpdatePreview = spyOn<any>(component, 'updatePreview');
        const spyButtonStyle = spyOn<any>(component, 'setButtonStyle');

        // Act
        component.italicToggled();

        // Assert
        expect(textService.attribute.isItalic).toBe(false);
        expect(component.isItalic).toBe(false);
        expect(spyUpdatePreview).toHaveBeenCalled();
        expect(spyButtonStyle).toHaveBeenCalled();
    });

    it('#alignChanged should set text #align in component and text service', () => {
        // Arrange
        const align: CanvasTextAlign = 'center';
        textService.attribute.isItalic = true;
        const spyUpdatePreview = spyOn<any>(component, 'updatePreview');
        const spyButtonStyle = spyOn<any>(component, 'setButtonStyle');

        // Act
        component.alignChanged(align);

        // Assert
        expect(textService.attribute.align).toBe(align);
        expect(component.align).toBe(align);
        expect(spyUpdatePreview).toHaveBeenCalled();
        expect(spyButtonStyle).toHaveBeenCalledTimes(3);
    });

    it('#setButtonStyle should change de button color according if it ref value is actif', () => {
        // Arrange
        const idInvalid = 'invald';
        const buttonInvalid = fixture.nativeElement.querySelector('#invalid');

        const idBold = 'bold';
        const buttonBold = fixture.nativeElement.querySelector('#bold');

        const idRight = 'right';
        const buttonRight = fixture.nativeElement.querySelector('#right');

        // Act
        component.setButtonStyle(idInvalid, true);
        component.setButtonStyle(idBold, true);
        component.setButtonStyle(idRight, false);

        // Assert
        expect(buttonInvalid).toBe(null);
        expect(buttonBold.style.backgroundColor).toBe('rgb(105, 240, 174)');
        expect(buttonRight.style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    });
});
