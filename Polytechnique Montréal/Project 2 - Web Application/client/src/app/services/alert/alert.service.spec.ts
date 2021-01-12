import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CanvasAlert } from '@app/classes/interfaces/canvas-alert';
import { AlertService } from './alert.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('WarningService', () => {
    let service: AlertService;
    let matsnackBar: jasmine.SpyObj<MatSnackBar>;

    matsnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
            providers: [{ provide: MatSnackBar, useValue: matsnackBar }],
        });
        service = TestBed.inject(AlertService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#showNewAlert should call next alertSource subject', () => {
        // Arrange
        spyOn<any>(service['alertSource'], 'next');

        // Act
        service.showNewAlert({} as CanvasAlert);

        // Assert
        expect(service['alertSource'].next).toHaveBeenCalled();
    });

    it('#showSnackBarAlert should open snackbar material', () => {
        // Arrange

        // Act
        service.showSnackBarAlert('error message');

        // Assert
        expect(matsnackBar.open).toHaveBeenCalled();
    });
});
