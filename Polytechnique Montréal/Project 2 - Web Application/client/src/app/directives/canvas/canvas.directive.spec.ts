import { Component, DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { Tool } from '@app/classes/tool/tool';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { CanvasDirective } from './canvas.directive';
@Component({
    template: '<canvas #canvas appCanvas id="canvas"></canvas>',
})
class TestCanvasComponent {}
describe('Directive: Canvas', () => {
    let canvasEl: DebugElement;
    let currentTool: Tool;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestCanvasComponent, CanvasDirective],
            imports: [MatSnackBarModule],
        });
        const fixture = TestBed.createComponent(TestCanvasComponent);
        currentTool = TestBed.inject(ToolSelectNotifierService).currentTool;
        canvasEl = fixture.debugElement.query(By.css('canvas'));
        fixture.detectChanges();
    });

    it('pointer down event handled', () => {
        // Arrange
        const id = 2;
        const event = { pointerId: id } as PointerEvent;
        const spy = spyOn(canvasEl.nativeElement, 'setPointerCapture').and.returnValue({} as unknown);
        const handler = spyOn(currentTool, 'onMouseDown');

        // Act
        canvasEl.triggerEventHandler('pointerdown', event);

        // Assert
        expect(spy).toHaveBeenCalledWith(id);
        expect(handler).toHaveBeenCalledWith(event);
    });

    it('pointer up event handled', () => {
        // Arrange
        const id = 2;
        const event = { pointerId: id } as PointerEvent;
        const spy = spyOn(canvasEl.nativeElement, 'releasePointerCapture').and.returnValue({} as unknown);
        const handler = spyOn(currentTool, 'onMouseUp');

        // Act
        canvasEl.triggerEventHandler('pointerup', event);

        // Assert
        expect(spy).toHaveBeenCalledWith(id);
        expect(handler).toHaveBeenCalledWith(event);
    });

    it('pointer move handled', () => {
        // Arrange
        const event = {} as PointerEvent;
        const handler = spyOn(currentTool, 'onMouseMove');

        // Act
        canvasEl.triggerEventHandler('pointermove', event);

        // Assert
        expect(handler).toHaveBeenCalledWith(event);
    });

    it('pointer out handled', () => {
        // Arrange
        const event = {} as PointerEvent;
        const handler = spyOn(currentTool, 'onMouseOut');

        // Act
        canvasEl.triggerEventHandler('pointerout', event);

        // Assert
        expect(handler).toHaveBeenCalledWith(event);
    });

    it('mouse click handled', () => {
        // Arrange
        const event = {} as MouseEvent;
        const handler = spyOn(currentTool, 'onMouseClick');

        // Act
        canvasEl.triggerEventHandler('click', event);

        // Assert
        expect(handler).toHaveBeenCalledWith(event);
    });

    it('wheel event handled', () => {
        // Arrange
        const event = jasmine.createSpyObj('WheelEvent', ['preventDefault']);
        const handler = spyOn(currentTool, 'onWheelScroll');

        // Act
        canvasEl.triggerEventHandler('wheel', event);

        // Assert
        expect(event.preventDefault).toHaveBeenCalled();
        expect(handler).toHaveBeenCalledWith(event);
    });

    it('double click handled', () => {
        // Arrange
        const event = {} as MouseEvent;
        const handler = spyOn(currentTool, 'onMouseDoubleClick');

        // Act
        canvasEl.triggerEventHandler('dblclick', event);

        // Assert
        expect(handler).toHaveBeenCalledWith(event);
    });

    it('mousewheel handled', () => {
        // Arrange
        const event = jasmine.createSpyObj('WheelEvent', ['preventDefault']);
        const handler = spyOn(currentTool, 'onWheelScroll');

        // Act
        canvasEl.triggerEventHandler('wheel', event);

        // Assert
        expect(handler).toHaveBeenCalledWith(event);
    });

    it('context menu handled', () => {
        // Arrange
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);

        // Act
        canvasEl.triggerEventHandler('contextmenu', event);

        // Assert
        expect(event.preventDefault).toHaveBeenCalled();
    });
});
