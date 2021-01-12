import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { RequestResponse } from '@common/communication/database';
import { HttpStatusCode } from '@common/declarations/http';
import { of } from 'rxjs';
import { SaveDrawingComponent } from './save-drawing.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('SaveDrawingComponent', () => {
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;
    let matDialog: jasmine.SpyObj<MatDialog>;
    let canvasService: jasmine.SpyObj<CanvasService>;
    let shortcutHandler: jasmine.SpyObj<ShortcutHandlerService>;

    beforeEach(async(() => {
        matDialog = { ...jasmine.createSpyObj('MatDialog', ['open', 'closeAll']), openDialogs: { length: 2 } } as jasmine.SpyObj<MatDialog>;
        canvasService = jasmine.createSpyObj('CanvasService', ['']);

        shortcutHandler = jasmine.createSpyObj('ShortcutHandlerService', ['register']);

        TestBed.configureTestingModule({
            declarations: [SaveDrawingComponent],
            providers: [
                { provide: MatDialog, useValue: matDialog },
                { provide: ShortcutHandlerService, useValue: shortcutHandler },
            ],
            imports: [HttpClientTestingModule, MatDialogModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onClickAction should not save drawing if the canvas is empty', () => {
        // Arrange
        Object.defineProperty(canvasService, 'isEmpty', { value: true });
        const canvasStub = document.createElement('canvas');
        component['canvasService'].canvas = canvasStub;
        spyOn(component, 'initialiseValues' as any);

        // Act
        component['onClickAction']();

        // Assert
        expect(component['initialiseValues']).not.toHaveBeenCalled();
        expect(matDialog.open).not.toHaveBeenCalled();
    });

    it('#onClickAction should save drawing if the canvas is not empty', () => {
        // Arrange
        component['canvasService'].isEmpty = false;
        const canvasStub = document.createElement('canvas');
        component['canvasService'].canvas = canvasStub;
        spyOn(component, 'initialiseValues' as any);

        // Act
        component['onClickAction']();

        // Assert
        expect(component['initialiseValues']).toHaveBeenCalled();
        expect(matDialog.open).toHaveBeenCalled();
    });

    it('#onAddButtonClicked should call addTag of service', () => {
        // Arrange
        const event: Event = new Event('clicked');
        spyOn(component['saveDrawingService'], 'addTag');

        // Act
        component.onAddButtonClicked(event);

        // Assert
        expect(component['saveDrawingService'].addTag).toHaveBeenCalledTimes(1);
    });

    it('#onAddButtonClicked should not detect value of #tagsForm if FormControl is invalid', () => {
        // Arrange
        const event: Event = new Event('clicked');
        spyOn(component['saveDrawingService'], 'addTag');
        component.tagsForm = new FormGroup({});

        // Act
        component.onAddButtonClicked(event);

        // Assert
        expect(component.tagsForm.get('currentTag')).toEqual(null);
    });

    it('#deleteTag should call deleteTag of service', () => {
        // Arrange
        spyOn(component['saveDrawingService'], 'deleteTag');

        // Act
        component.deleteTag(0);

        // Assert
        expect(component['saveDrawingService'].deleteTag).toHaveBeenCalledTimes(1);
    });

    it('#onFocus should call reset the response', () => {
        // Arrange
        const noResponse = {} as RequestResponse;

        // Act
        component.onFocus();

        // Assert
        expect(component.serverResponse).toEqual(noResponse);
    });

    it('#onCloseButtonClicked should close the mat dialog', () => {
        // Arrange

        // Act
        component.onCloseButtonClicked();

        // Assert
        expect(matDialog.closeAll).toHaveBeenCalled();
    });

    it('#onSaveClick should call subscribe to the post request made', () => {
        // Arrange
        const response: RequestResponse = {} as RequestResponse;
        spyOn(component['saveDrawingService'], 'sendData').and.returnValue(of(response));

        // Act
        component.onSaveClick();
        fixture.detectChanges();

        // Assert
        expect(component.serverResponse).toEqual(response);
        expect(component.isMakingHttpRequest).toEqual(false);
    });

    it('#onSaveClick should not detect value of #savingForm if FormControl is invalid', () => {
        // Arrange
        const response: RequestResponse = {} as RequestResponse;
        spyOn(component['saveDrawingService'], 'sendData').and.returnValue(of(response));
        component.savingForm = new FormGroup({});

        // Act
        component.onSaveClick();

        // Assert
        expect(component.savingForm.get('drawingName')).toEqual(null);
    });

    it('#saveDrawingAction should call #onClickAction if openDialog length is above 0', () => {
        // Arrange
        spyOn<any>(component, 'onClickAction');

        // Act
        component['saveDrawingAction']();

        // Assert
        expect(component.onClickAction).not.toHaveBeenCalled();
    });

    it('#saveDrawingAction should call #onClickAction if openDialog length is less or equal 0', () => {
        // Arrange
        const spy = spyOn<any>(component, 'onClickAction');
        spyOn<any>(matDialog, 'openDialogs').and.returnValue({ length: 0 });

        // Act
        component['saveDrawingAction']();

        // Assert
        expect(spy).toHaveBeenCalled();
    });

    it('#verifyResponse should close mat dialog if response is success', () => {
        // Arrange
        const response: RequestResponse = { status: HttpStatusCode.Success, message: 'OK' };
        spyOn(component['alertService'], 'showNewAlert');

        // Act
        component['verifyResponse'](response);

        // Assert
        expect(matDialog.closeAll).toHaveBeenCalled();
        expect(component['alertService'].showNewAlert).toHaveBeenCalled();
    });
});
