import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { FILTER_DATA } from '@app/declarations/export-data';
import { MaterialModule } from '@app/material.module';
import { AlertService } from '@app/services/alert/alert.service';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { ExportDrawingService } from '@app/services/export-drawing/export-drawing.service';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { RequestResponse } from '@common/communication/database';
import { of } from 'rxjs';
import { ExportDrawingComponent } from './export-drawing.component';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
describe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;

    let canvasService: jasmine.SpyObj<CanvasService>;
    let exportDrawingDialog: jasmine.SpyObj<MatDialog>;
    let exportDrawingService: jasmine.SpyObj<ExportDrawingService>;
    let alertService: jasmine.SpyObj<AlertService>;
    let shortcutHandler: jasmine.SpyObj<ShortcutHandlerService>;

    beforeEach(async(() => {
        exportDrawingDialog = { ...jasmine.createSpyObj('MatDialog', ['closeAll', 'open']), openDialogs: { length: 2 } } as jasmine.SpyObj<MatDialog>;
        exportDrawingService = jasmine.createSpyObj('ExportDrawingService', [
            'resetFilter',
            'download',
            'findFilter',
            'updateCssProperty',
            'sendEmail',
        ]);
        alertService = jasmine.createSpyObj('AlertService', ['showNewAlert']);

        shortcutHandler = jasmine.createSpyObj('ShortcutHandlerService', ['register']);
        exportDrawingService.findFilter.and.returnValue(FILTER_DATA[1]);
        const canvasStub = canvasTestHelper.canvas;
        canvasService = {
            ...jasmine.createSpyObj('CanvasService', ['clean', 'isEmpty', 'clearCanvas']),
            canvas: canvasStub,
        } as jasmine.SpyObj<CanvasService>;

        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent],
            providers: [
                { provide: CanvasService, useValue: canvasService },
                { provide: MatDialog, useValue: exportDrawingDialog },
                { provide: ExportDrawingService, useValue: exportDrawingService },
                { provide: AlertService, useValue: alertService },
                { provide: ShortcutHandlerService, useValue: shortcutHandler },
            ],
            imports: [HttpClientTestingModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#sliderFormatLabel should return (value°) when #unit is deg', () => {
        // Arrange
        const value = 10;
        component.currentFilter = FILTER_DATA[4];

        // Act
        const testValue = component.sliderFormatLabel(value);

        // Assert
        expect(testValue).toBe('10°');
    });

    it('#sliderFormatLabel should return actual unit value when #unit is not deg', () => {
        // Arrange
        const value = 20;
        component.currentFilter = FILTER_DATA[1];

        // Act
        const testValue = component.sliderFormatLabel(value);

        // Assert
        expect(testValue).toBe(value.toString() + '%');
    });

    it('#onExportClick should call #download from export service with valid form', () => {
        // Arrange
        const event = new Event('click');
        spyOn(component.exportForm, 'get').and.returnValue({ value: 'value' } as any);

        // Act
        component.onExportClick(event);

        // Assert
        expect(exportDrawingService.download).toHaveBeenCalled();
    });

    it('#onExportClick should call #download from export service with non valid form', () => {
        // Arrange
        const event = new Event('click');
        component.exportForm = new FormGroup({});

        // Act
        component.onExportClick(event);

        // Assert
        expect(component.exportForm.get('drawingName')).toEqual(null);
    });

    it('#filterChanged should call #updateFilterSettings', () => {
        // Arrange
        const radio: any = {};
        const event = { source: radio, value: 'Sepia' };
        spyOn<any>(component, 'updateFilterSettings');

        // Act
        component.filterChanged(event);

        // Assert
        expect(component.currentFilter.name).toEqual('Sepia');
    });

    it('#updateFilterSettings should call #updateCssProperty in export service', () => {
        // Arrange

        // Act
        component.updateFilterSettings();

        // Assert
        expect(exportDrawingService.updateCssProperty).toHaveBeenCalled();
    });

    it('#sliderValueChanged should call #updateCssProperty', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 20 };

        // Act
        component.sliderValueChanged(event);

        // Assert
        expect(exportDrawingService.updateCssProperty).toHaveBeenCalled();
    });

    it('#formatChanged should change #currentFormat to JPEG on radio changed to JPEG', () => {
        // Arrange
        const radio: any = {};
        const event = { source: radio, value: 'JPEG' };

        // Act
        component.formatChanged(event);

        // Assert
        expect(component.currentFormat).toEqual('JPEG');
    });

    it('#onClickAction should call #open if canvas is not empty', () => {
        // Arrange
        canvasService.isEmpty = false;
        spyOn<any>(canvasService.canvas, 'toDataURL');

        // Act
        component.onClickAction();

        // Assert
        expect(exportDrawingDialog.open).toHaveBeenCalled();
    });

    it('#onClickAction should call #showNewAlert if canvas is empty', () => {
        // Arrange
        canvasService.isEmpty = true;
        spyOn<any>(component, 'resetSettings');

        // Act
        component.onClickAction();

        // Assert
        expect(alertService.showNewAlert).toHaveBeenCalled();
    });

    it('#onCloseButtonClicked should call #resetSettings', () => {
        // Arrange

        // Act
        component.onCloseButtonClicked();

        // Assert
        expect(exportDrawingDialog.closeAll).toHaveBeenCalled();
    });

    it('#exportDrawingAction should call #onClickAction if openDialog length is above 0', () => {
        // Arrange
        spyOn<any>(component, 'onClickAction');

        // Act
        component['exportDrawingAction']();

        // Assert
        expect(component.onClickAction).not.toHaveBeenCalled();
    });

    it('#exportDrawingAction should call #onClickAction if openDialog length is less or equal 0', () => {
        // Arrange
        const spy = spyOn<any>(component, 'onClickAction');
        spyOn<any>(exportDrawingDialog, 'openDialogs').and.returnValue({ length: 0 });

        // Act
        component['exportDrawingAction']();

        // Assert
        expect(spy).toHaveBeenCalled();
    });

    it('#onEmailButtonClicked should call subscribe to the post request made', () => {
        // Arrange
        const response: RequestResponse = {} as RequestResponse;
        exportDrawingService.sendEmail.and.returnValue(of(response));

        // Act
        component.onEmailButtonClicked();
        fixture.detectChanges();

        // Assert
        expect(component.serverResponse).toEqual(response);
        expect(component.isSendingEmail).toEqual(false);
    });

    it('#closeEmailResponse should modify #serverResponse to null', () => {
        // Arrange
        const response: RequestResponse = {} as RequestResponse;

        // Act
        component.closeEmailResponse();

        // Assert
        expect(component.serverResponse).toEqual(response);
    });

    it('#onEmailButtonClicked should net email to null if formControl is invalid', () => {
        // Arrange
        component.exportForm = new FormGroup({});
        const response: RequestResponse = {} as RequestResponse;
        exportDrawingService.sendEmail.and.returnValue(of(response));

        // Act
        component.onEmailButtonClicked();

        // Assert
        expect(component.exportForm.get('emailAddress')).toEqual(null);
    });
});
