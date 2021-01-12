import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { ResizeIndicatorComponent } from './resize-indicator.component';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('ResizeIndicatorComponent', () => {
    let component: ResizeIndicatorComponent;
    let fixture: ComponentFixture<ResizeIndicatorComponent>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let toolSelectNotifierServiceSpy: jasmine.SpyObj<ToolSelectNotifierService>;

    beforeEach(async(() => {
        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview']),
            canvasWidth: 100,
            canvasHeight: 100,
        } as jasmine.SpyObj<DrawingService>;

        toolSelectNotifierServiceSpy = jasmine.createSpyObj('ToolSelectNotifierService', ['isToolPreviewCleanable']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ToolSelectNotifierService, useValue: toolSelectNotifierServiceSpy },
            ],
            declarations: [ResizeIndicatorComponent],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResizeIndicatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call #addMouseListeners after view init', () => {
        // Arrange
        spyOn<any>(component, 'addMouseListeners');

        // Act
        component.ngAfterViewInit();

        // Assert
        expect(component['addMouseListeners']).toHaveBeenCalled();
    });

    it('should set #mouseDown to true on pointer down event', () => {
        // Arrange
        const event = new PointerEvent('pointerdown', { pointerId: 1 });
        component['mouseDown'] = false;
        spyOn(component.resizeIndicator.nativeElement, 'setPointerCapture');

        // Act
        component.resizeIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(component['mouseDown']).toBeTrue();
        expect(component.resizeIndicator.nativeElement.setPointerCapture).toHaveBeenCalled();
    });

    it('should set #mouseDown to false on pointerup event', () => {
        // Arrange
        spyOn(component.resizeIndicator.nativeElement, 'releasePointerCapture');
        const event = new PointerEvent('pointerup');
        component['mouseDown'] = true;

        // Act
        component.resizeIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(component['mouseDown']).toBeFalse();
        expect(component.resizeIndicator.nativeElement.releasePointerCapture).toHaveBeenCalled();
    });

    it('should emit a #isReleased event on pointerup event', () => {
        // Arrange
        const event = new PointerEvent('pointerup', { pointerId: 1 });
        component['mouseDown'] = true;
        const isReleasedEventSpy = spyOn(component.isReleased, 'emit');

        // Act
        component['mouseDown'] = true;
        component.resizeIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(isReleasedEventSpy).toHaveBeenCalled();
    });

    it('should emit an #isDragged event on  mouse move event if #mouseDown is true', () => {
        // Arrange
        const event = new PointerEvent('pointermove');
        const isDraggedEventSpy = spyOn(component.isDragged, 'emit');
        component['mouseDown'] = true;

        // Act
        component.resizeIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(isDraggedEventSpy).toHaveBeenCalled();
    });

    it('should not call cleanPreview if #isToolCleanable is false', () => {
        // Arrange
        const event = new PointerEvent('pointermove');
        spyOn<any>(component, 'emitMousePositionMovement');
        component['mouseDown'] = false;
        toolSelectNotifierServiceSpy.isToolPreviewCleanable.and.returnValue(false);

        // Act
        component.resizeIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(drawServiceSpy['cleanPreview']).not.toHaveBeenCalled();
    });

    it('should not call cleanPreview if #isToolCleanable is true', () => {
        // Arrange
        const event = new PointerEvent('pointermove');
        spyOn<any>(component, 'emitMousePositionMovement');
        component['mouseDown'] = false;
        toolSelectNotifierServiceSpy.isToolPreviewCleanable.and.returnValue(true);

        // Act
        component.resizeIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(drawServiceSpy['cleanPreview']).toHaveBeenCalled();
    });

    it('should emit mouse position on  mouse move event if #mouseDown is true', () => {
        // Arrange
        const event = new PointerEvent('pointermove');
        spyOn<any>(component, 'emitMousePositionMovement');
        component['mouseDown'] = true;

        // Act
        component.resizeIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(component['emitMousePositionMovement']).toHaveBeenCalled();
        expect(component['emitMousePositionMovement']).toHaveBeenCalledWith(event);
    });

    it('should do nothing on  mouse move event if #mouseDown is false', () => {
        // Arrange
        const event = new PointerEvent('pointermove');
        const isDraggedEventSpy = spyOn(component.isDragged, 'emit');
        component['mouseDown'] = false;

        // Act
        component.resizeIndicator.nativeElement.dispatchEvent(event);

        // Assert
        expect(component['mouseDown']).toBeFalse();
        expect(isDraggedEventSpy).not.toHaveBeenCalled();
    });

    it('#emitMousePositionMovement should do nothing if #mouseDown is false', () => {
        // Arrange
        const event = {} as any;
        const resizeChangeEventSpy = spyOn(component.resizeChange, 'emit');
        component['mouseDown'] = false;

        // Act
        component['emitMousePositionMovement'](event);

        // Assert
        expect(component['mouseDown']).toBeFalse();
        expect(resizeChangeEventSpy).not.toHaveBeenCalled();
    });
});
