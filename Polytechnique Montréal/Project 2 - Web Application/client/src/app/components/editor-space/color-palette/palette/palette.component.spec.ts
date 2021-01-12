import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Color, ColorAttributes } from '@app/classes/color/color';
import { MaterialModule } from '@app/material.module';
import { PaletteComponent } from './palette.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any

const POINT_X = 55;
const POINT_Y = 89;
const HUE_VALUE = 209;
const INITIAL_BLUE_COLOR = 'rgba(62, 118, 169, 1)';
const INITIAL_VALUE = 20;
const FINAL_VALUE = 100;

describe('PaletteComponent', () => {
    let component: PaletteComponent;
    let fixture: ComponentFixture<PaletteComponent>;
    let mouseEvent: MouseEvent;
    let changes: SimpleChanges;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PaletteComponent],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaletteComponent);
        component = fixture.componentInstance;
        mouseEvent = { offsetX: POINT_X, offsetY: POINT_Y } as MouseEvent;
        changes = {
            rgbColor: new SimpleChange(INITIAL_VALUE, INITIAL_VALUE, false),
        };

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onMouseMoveCanvas should update x and y coordinates', () => {
        component.onMouseMoveCanvas(mouseEvent);

        expect(component['currentPoint'].x).toBe(mouseEvent.offsetX);
        expect(component['currentPoint'].y).toBe(mouseEvent.offsetY);
        expect(component.offsetX).toBe(`${mouseEvent.offsetX}px`);
        expect(component.offsetY).toBe(`${mouseEvent.offsetY}px`);
    });

    it('#onMouseMoveCanvas should call #emitLatestColor if #isMouseDown is true', () => {
        spyOn<any>(component, 'emitLatestColor');
        component['isMouseDown'] = true;
        component.onMouseMoveCanvas(mouseEvent);
        expect(component['emitLatestColor']).toHaveBeenCalledTimes(1);
    });

    it('#onMouseUpCanvas should set #isMouseDown to false', () => {
        component.onMouseUpCanvas();
        expect(component['isMouseDown']).toBe(false);
    });

    it('#onMouseDownCanvas should update colors depending on coordinate', () => {
        spyOn<any>(component, 'setCurrentPoints');
        spyOn<any>(component, 'setPointColor');
        component.onMouseDownCanvas(mouseEvent);
        expect(component['setCurrentPoints']).toHaveBeenCalled();
        expect(component['setPointColor']).toHaveBeenCalled();
    });

    it('#onMouseDownCanvas should emit new color obtained', () => {
        const attributes: ColorAttributes = {
            red: 'ff',
            green: '00',
            blue: '00',
            hexCode: 'ff0000',
            opacity: 1,
            hueValue: 0,
        };

        let initialColor: Color = new Color(attributes);
        expect(initialColor.hexCodeValue).toBe('#ff0000');

        component.canvasColor.subscribe((color: Color) => {
            initialColor = color;
            expect(initialColor.hexCodeValue).not.toBe('#ff0000');
        });
        component.onMouseDownCanvas(mouseEvent);
    });

    it('#setPointColor should update the color values of #color as soon as the coordinates have been updated', () => {
        component.hueValue = HUE_VALUE;
        expect(component['color']).toEqual(new Color()); // initially null object
        component['setPointColor'](0, 0);
        expect(component['color']).not.toEqual(new Color()); // now contains color attributes
    });

    it('#setCurrentPoints shoud update latest coordinates', () => {
        component['setCurrentPoints'](mouseEvent);
        expect(component['currentPoint'].x).toBe(mouseEvent.offsetX);
        expect(component['currentPoint'].y).toBe(mouseEvent.offsetY);
        expect(component.offsetX).toBe(`${mouseEvent.offsetX}px`);
        expect(component.offsetY).toBe(`${mouseEvent.offsetY}px`);
    });

    it('#drawOnCanvas should define a color for rgbColor if this variable is null', () => {
        component.rgbColor = '';
        component['drawOnCanvas']();
        expect(component.rgbColor).toBe(INITIAL_BLUE_COLOR);
    });

    it('#drawOnCanvas should call #fillCanvas', () => {
        const numberTimesCalled = 3;

        spyOn<any>(component, 'fillCanvas');
        component['drawOnCanvas']();
        expect(component['fillCanvas']).toHaveBeenCalledTimes(numberTimesCalled);
    });

    it('#ngOnChanges should call #drawOnCanvas when detecting a color change', () => {
        spyOn<any>(component, 'drawOnCanvas');
        component.ngOnChanges(changes);
        fixture.detectChanges();

        expect(component['drawOnCanvas']).toHaveBeenCalled();
    });

    it('#ngOnChanges should not call #drawOnCanvas if #rgbColor has not been changed', () => {
        spyOn<any>(component, 'drawOnCanvas');
        changes = {
            noAttribue: new SimpleChange(INITIAL_VALUE, FINAL_VALUE, false),
        };

        component.ngOnChanges(changes);
        fixture.detectChanges();

        expect(component['drawOnCanvas']).not.toHaveBeenCalled();
    });

    it('#ngOnChanges should not call #drawOnCanvas if #rgbColor is invalid and unchanged', () => {
        spyOn<any>(component, 'drawOnCanvas');
        component.rgbColor = '';
        component.ngOnChanges(changes);
        fixture.detectChanges();

        expect(component['drawOnCanvas']).not.toHaveBeenCalled();
    });

    it('#ngOnChanges should call #drawOnCanvas if #rgbColor is valid and changed', () => {
        spyOn<any>(component, 'drawOnCanvas');
        component.rgbColor = INITIAL_BLUE_COLOR;
        component.ngOnChanges(changes);
        fixture.detectChanges();

        expect(component['drawOnCanvas']).toHaveBeenCalled();
    });
});
