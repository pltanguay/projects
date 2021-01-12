import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppModule } from '@app/app.module';
import { InitialMemento } from '@app/classes/undo-redo/memento/initial-memento';
import { CircularBuffer } from '@app/classes/utils/ring-buffer';
import { CanvasLoaderService } from '@app/services/canvas/canvas-loader/canvas-loader.service';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { FilterService } from '@app/services/carousel/filter/filter.service';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { RequestResponse } from '@common/communication/database';
import { DrawingData } from '@common/communication/drawing-data';
import { HttpStatusCode } from '@common/declarations/http';
import { of } from 'rxjs';
import { CarouselComponent } from './carousel.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any

const dialogMock = {
    close: () => {
        return;
    },
};

describe('CarouselComponent', () => {
    let component: CarouselComponent;
    let canvasServiceSpy: jasmine.SpyObj<CanvasService>;
    let filterServiceSpy: jasmine.SpyObj<FilterService>;
    let carouselServiceSpy: jasmine.SpyObj<CarouselService>;
    let snapShotSpy: jasmine.SpyObj<SnapshotFactoryService>;
    let shortcutSpy: jasmine.SpyObj<ShortcutHandlerService>;
    let canvasLoaderSpy: jasmine.SpyObj<CanvasLoaderService>;
    let matDialog: jasmine.SpyObj<MatDialog>;
    let fixture: ComponentFixture<CarouselComponent>;
    const testDrawing: DrawingData = { drawingName: 'TsPaint', tags: ['Poly'] };

    beforeEach(async(() => {
        matDialog = jasmine.createSpyObj('MatDialog', ['close']);
        canvasServiceSpy = jasmine.createSpyObj('CanvasService', [
            'onFilterInputEnter',
            'reset',
            'restore',
            'getDrawingsFromServer',
            'onDrawingClicked',
            'storeImageData',
        ]);
        snapShotSpy = jasmine.createSpyObj('SnapshotFactoryService', ['save']);
        canvasLoaderSpy = jasmine.createSpyObj('CanvasLoaderService', ['openDrawing']);
        shortcutSpy = jasmine.createSpyObj('ShortcutHandlerService', ['register']);
        filterServiceSpy = jasmine.createSpyObj('FilterService', ['applyFilter', 'restore', 'reset', 'tryUpdateFilters']);
        carouselServiceSpy = {
            ...jasmine.createSpyObj('CarouselService', ['reset', 'getDrawings', 'deleteDrawing', 'canOpen', 'next', 'previous']),
            drawingsLength: 2,
        };

        carouselServiceSpy.getDrawings.and.returnValue(of({} as RequestResponse));
        canvasLoaderSpy.openDrawing.and.returnValue(of({} as InitialMemento));
        filterServiceSpy.filters = [];
        carouselServiceSpy['ringBuffer'] = new CircularBuffer();

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, NoopAnimationsModule, AppModule],
            declarations: [CarouselComponent],
            providers: [
                { provide: MatDialog, useValue: matDialog },
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: CanvasService, useValue: canvasServiceSpy },
                { provide: SnapshotFactoryService, useValue: snapShotSpy },
                { provide: FilterService, useValue: filterServiceSpy },
                { provide: CarouselService, useValue: carouselServiceSpy },
                { provide: ShortcutHandlerService, useValue: shortcutSpy },
                { provide: CanvasLoaderService, useValue: canvasLoaderSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onFilterInputEnter should call applyFilter and reset filer', () => {
        // Arrange

        // Act
        component.onFilterInputEnter('Test');

        // Assert
        expect(filterServiceSpy.applyFilter).toHaveBeenCalled();
        expect(component.filter).toEqual('');
    });

    it('#onFilterInputEnter should not call applyFilter if value is null', () => {
        // Arrange

        // Act
        component.onFilterInputEnter('');

        // Assert
        expect(filterServiceSpy.applyFilter).not.toHaveBeenCalled();
    });

    it('#restore should restore of service', () => {
        // Arrange

        // Act
        component.restore();

        // Assert
        expect(filterServiceSpy.restore).toHaveBeenCalled();
    });

    it('#onDrawingClicked should open drawing if canvas is empty', () => {
        // Arrange
        spyOn(component, 'openDrawing');
        carouselServiceSpy.canOpen.and.returnValue(true);

        // Act
        component.onDrawingClicked(testDrawing);

        // Assert
        expect(component.openDrawing).toHaveBeenCalled();
    });

    it('#onDrawingClicked should not open drawing if canvas is not empty', () => {
        // Arrange
        spyOn(component, 'openDrawing');
        canvasServiceSpy.isEmpty = false;

        // Act
        component.onDrawingClicked(testDrawing);

        // Assert
        expect(component.openDrawing).not.toHaveBeenCalled();
        expect(component.canShowConfirmation).toBe(true);
    });

    it('#closeConfirm should set #canShowConfirmation to false', () => {
        // Arrange

        // Act
        component.closeConfirm();

        // Assert
        expect(component.canShowConfirmation).toBe(false);
    });

    it('#onDeleteDrawing should subscribe and call #handleDeleteResponse', () => {
        // Arrange
        spyOn<any>(component, 'handleDeleteResponse');
        const response: RequestResponse = {} as RequestResponse;
        carouselServiceSpy.selectedDrawing = testDrawing;
        carouselServiceSpy.deleteDrawing.and.returnValue(of(response));

        // Act
        component.onDeleteDrawing(testDrawing);
        fixture.detectChanges();

        // Assert
        expect(component['handleDeleteResponse']).toHaveBeenCalled();
    });

    it('#getDrawingsFromServer should set #shouldLoadSpinner to false', () => {
        // Arrange
        const response: RequestResponse = {} as RequestResponse;
        carouselServiceSpy.getDrawings.and.returnValue(of(response));

        // Act
        component.getDrawingsFromServer();
        fixture.detectChanges();

        // Assert
        expect(component.shouldLoadSpinner).toBe(false);
    });

    it('#updateDrawingLayout should set #carouselCssClass to null while communicating with server', () => {
        // Arrange
        component.shouldLoadSpinner = true;

        // Act
        component.updateDrawingLayout();

        // Assert
        expect(component.carouselCssClass).toEqual('');
    });

    it('#updateDrawingLayout should not modify #carouselCssClass if #isServerDown is true', () => {
        // Arrange
        const className = 'test';
        component.carouselCssClass = className;
        component.isServerDown = true;

        // Act
        component.updateDrawingLayout();

        // Assert
        expect(component.carouselCssClass).toEqual(className);
    });

    it('#updateDrawingLayout should set #carouselCssClass to drawingFiltered if there is no drawing', () => {
        // Arrange
        component.isServerDown = false;
        component.shouldLoadSpinner = false;
        component.canShowConfirmation = false;
        filterServiceSpy.unfilteredImages = new CircularBuffer();
        filterServiceSpy.unfilteredImages.add([testDrawing]);
        component.carouselService = { ...carouselServiceSpy, drawingsLength: 0 } as any;

        // Act
        component.updateDrawingLayout();

        // Assert
        expect(component.carouselCssClass).toEqual('drawingFiltered');
    });

    it('#updateDrawingLayout should set #carouselCssClass to show-confirmation if #canShowConfirmation is true', () => {
        // Arrange
        component.shouldLoadSpinner = false;
        component.canShowConfirmation = true;
        carouselServiceSpy['ringBuffer'] = new CircularBuffer();
        filterServiceSpy.unfilteredImages = new CircularBuffer();

        // Act
        component.updateDrawingLayout();

        // Assert
        expect(component.carouselCssClass).toEqual('show-confirmation');
    });

    it('#updateDrawingLayout should set #carouselCssClass to drawing0', () => {
        // Arrange
        component.shouldLoadSpinner = false;
        component.canShowConfirmation = false;
        component.carouselService = { ...carouselServiceSpy, drawingsLength: 0 } as any;
        filterServiceSpy.unfilteredImages = new CircularBuffer();

        // Act
        component.updateDrawingLayout();

        // Assert
        expect(component.carouselCssClass).toEqual('drawing0');
    });

    it('#handleDeleteResponse should update filters and remove message if the request is success', () => {
        // Arrange
        const response: RequestResponse = { status: HttpStatusCode.Success, message: 'OK' };
        spyOn<any>(component, 'removeResponseMessage');

        // Act
        component['handleDeleteResponse'](response, testDrawing);

        // Assert
        expect(filterServiceSpy.tryUpdateFilters).toHaveBeenCalled();
        expect(component['removeResponseMessage']).toHaveBeenCalled();
    });

    it('#handleDeleteResponse should not update filters if the request is error', () => {
        // Arrange
        const response: RequestResponse = { status: HttpStatusCode.Server_Error, message: 'server down' };

        // Act
        component['handleDeleteResponse'](response, testDrawing);

        // Assert
        expect(filterServiceSpy.tryUpdateFilters).not.toHaveBeenCalled();
    });

    it('#validateResponse set #isServerDown to #true if response is failure', () => {
        // Arrange
        const response: RequestResponse = { status: HttpStatusCode.Server_Error, message: 'server down' };

        // Act
        component['validateResponse'](response);

        // Assert
        expect(component.isServerDown).toBe(true);
    });

    it('#validateResponse set #isServerDown to #false if response is success', () => {
        // Arrange
        const response: RequestResponse = { status: HttpStatusCode.Success, message: 'OK' };

        // Act
        component['validateResponse'](response);

        // Assert
        expect(component.isServerDown).toBe(false);
    });

    it('#removeResponseMessage should reset #serverResponse after an interval', () => {
        // Arrange
        const duration = 2500;
        const emptyResponse = {} as RequestResponse;

        // Act
        jasmine.clock().install();
        component['removeResponseMessage']();
        jasmine.clock().tick(duration);

        // Assert
        expect(component.serverResponse).toEqual(emptyResponse);

        jasmine.clock().uninstall();
    });

    it('#openDrawing should call #openDrawing and save action', fakeAsync(() => {
        // Arrange
        const momento: InitialMemento = {} as InitialMemento;
        carouselServiceSpy.selectedDrawing = testDrawing;
        canvasLoaderSpy.openDrawing.and.returnValue(of(momento));

        // Act
        component.openDrawing();
        tick();

        // Assert
        expect(snapShotSpy.save).toHaveBeenCalled();

        flush();
    }));
});
