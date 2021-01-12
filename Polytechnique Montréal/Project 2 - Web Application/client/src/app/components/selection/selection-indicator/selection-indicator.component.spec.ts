import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { MouseButton } from '@app/declarations/mouse.enum';
import { SelectionIndicatorComponent } from './selection-indicator.component';

// tslint:disable:no-string-literal
describe('SelectionIndicatorComponent', () => {
    let component: SelectionIndicatorComponent;
    let fixture: ComponentFixture<SelectionIndicatorComponent>;
    let renderer: jasmine.SpyObj<Renderer2>;

    beforeEach(async(() => {
        renderer = jasmine.createSpyObj('Renderer2', ['listen']);

        TestBed.configureTestingModule({
            declarations: [SelectionIndicatorComponent],
            providers: [{ provide: Renderer2, useValue: renderer }],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionIndicatorComponent);
        component = fixture.componentInstance;
        component['last'] = { x: 0, y: 0 };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on pointerdown should set mousedown to true and emit mouseisDown ', () => {
        // Arrange
        const event = new PointerEvent('pointerdown', { pointerId: 1, button: MouseButton.Right });
        spyOn(component.mouseIsDown, 'emit');
        spyOn(component.selectionIndicator.nativeElement, 'setPointerCapture');

        // Act
        component.selectionIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(component.mouseIsDown.emit).toHaveBeenCalled();
        expect(component.selectionIndicator.nativeElement.setPointerCapture).toHaveBeenCalled();
        expect(component['mouseDown']).toBeTrue();
    });

    it('on pointerup should set mousedown to false and emit mouseisUp ', () => {
        // Arrange
        const event = new PointerEvent('pointerup', { pointerId: 1, button: MouseButton.Right });
        spyOn(component.mouseIsUp, 'emit');
        spyOn(component.selectionIndicator.nativeElement, 'releasePointerCapture');

        // Act
        component.selectionIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(component.mouseIsUp.emit).toHaveBeenCalled();
        expect(component.selectionIndicator.nativeElement.releasePointerCapture).toHaveBeenCalled();
        expect(component['mouseDown']).toBeFalse();
    });

    it('on pointermove should do nothing if mouseDown is false ', () => {
        // Arrange
        const event = new PointerEvent('pointermove', { pointerId: 1, button: MouseButton.Right });
        spyOn(component, 'emitMousePositionMovement');
        component['mouseDown'] = false;

        // Act
        component.selectionIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(component.emitMousePositionMovement).not.toHaveBeenCalled();
    });

    it('on pointermove should emit mouse position if mouseDown was true ', () => {
        // Arrange
        const event = new PointerEvent('pointermove', { pointerId: 1, button: MouseButton.Right });
        spyOn(component.isDragged, 'emit');
        spyOn(component, 'emitMousePositionMovement');

        component['mouseDown'] = true;
        // Act
        component.selectionIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(component.emitMousePositionMovement).toHaveBeenCalled();
        expect(component.isDragged.emit).toHaveBeenCalled();
    });

    it('on pointermove should emit shit released event when shift key is released', () => {
        // Arrange
        const event = new PointerEvent('pointermove', { pointerId: 1, button: MouseButton.Right, shiftKey: false });
        component['shifIsClicked'] = true;
        spyOn(component.shiftIsReleased, 'emit');
        component['mouseDown'] = true;

        // Act
        component.selectionIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(component.shiftIsReleased.emit).toHaveBeenCalled();
    });

    it('#emitmouseposition should emit resize change event', () => {
        // Arrange
        spyOn(component.resizeChange, 'emit');
        component['mouseDown'] = true;

        // Act
        component.emitMousePositionMovement({} as MouseEvent);

        // Assert
        expect(component.resizeChange.emit).toHaveBeenCalled();
    });

    it('#emitmouseposition should not emit resize change event', () => {
        // Arrange
        spyOn(component.resizeChange, 'emit');
        component['mouseDown'] = false;

        // Act
        component.emitMousePositionMovement({} as MouseEvent);

        // Assert
        expect(component.resizeChange.emit).not.toHaveBeenCalled();
    });
});
