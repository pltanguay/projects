import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { AlertService } from '@app/services/alert/alert.service';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { LocalStorageService } from './local-storage.service';

// tslint:disable: no-string-literal
// tslint:disable: no-any

describe('LocalStorageService', () => {
    let service: LocalStorageService;
    let canvasService: jasmine.SpyObj<CanvasService>;
    let alertService: jasmine.SpyObj<AlertService>;

    beforeEach(() => {
        alertService = jasmine.createSpyObj('AlertService', ['showNewAlert']);
        canvasService = {
            ...jasmine.createSpyObj('CanvasService', ['']),
            canvas: canvasTestHelper.canvas,
        } as jasmine.SpyObj<CanvasService>;

        TestBed.configureTestingModule({
            providers: [
                { provide: AlertService, useValue: alertService },
                { provide: CanvasService, useValue: canvasService },
            ],
            imports: [MatSnackBarModule],
        });

        service = TestBed.inject(LocalStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#save should save the canvas data to local storage', () => {
        // Arrange
        const store: any = {};
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
            return (store[key] = value as string);
        });

        // Act
        service.save();

        // Assert
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('#getItem should get item from local storage', () => {
        // Arrange
        const store: any = {};
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            return store[key];
        });

        // Act
        service.getItem();

        // Assert
        expect(localStorage.getItem).toHaveBeenCalled();
    });

    it('#showAlert should be called if canvas is not empty', () => {
        // Arrange
        const store: any = {};
        const spy = spyOn<any>(service, 'showAlert');
        canvasService.isEmpty = false;
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
            return (store[key] = value as string);
        });

        // Act
        service.save();

        // Assert
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('#showAlert should not be called if canvas is empty', () => {
        // Arrange
        const store: any = {};
        const spy = spyOn<any>(service, 'showAlert');
        canvasService.isEmpty = true;
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
            return (store[key] = value as string);
        });

        // Act
        service.save();

        // Assert
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
    });
});
