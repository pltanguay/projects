import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CanvasAlert } from '@app/classes/interfaces/canvas-alert';
import { AlertService } from '@app/services/alert/alert.service';
import { AlertComponent } from './alert.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any

const ERROR_MESSAGE_DURATION = 2800;

describe('AlertComponent', () => {
    let component: AlertComponent;
    let service: AlertService;
    let fixture: ComponentFixture<AlertComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AlertComponent],
            imports: [MatSnackBarModule],
        }).compileComponents();
        service = TestBed.inject(AlertService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onNewAlert must not be called it no component has sent an alert', () => {
        // Arrange
        spyOn<any>(component, 'onNewAlert');

        // Act
        service.showNewAlert({
            canShowAlert: true,
            hasBeenSentByComponent: false,
            alert: 'New Alert',
        });
        fixture.detectChanges();

        // Assert
        expect(component.onNewAlert).not.toHaveBeenCalled();
    });

    it('#onNewAlert must be called it any component has sent an alert', () => {
        // Arrange
        spyOn<any>(component, 'onNewAlert');

        // Act
        service.showNewAlert({
            canShowAlert: true,
            hasBeenSentByComponent: true,
            alert: 'New Alert',
        });
        fixture.detectChanges();

        // Assert
        expect(component.onNewAlert).toHaveBeenCalled();
    });

    it('#onNewAlert must not be called it the canvas is currently active', () => {
        // Arrange
        spyOn<any>(component, 'onNewAlert');
        component.canvasAlert.canShowAlert = true;

        // Act
        service.showNewAlert({
            canShowAlert: true,
            hasBeenSentByComponent: true,
            alert: 'New Alert',
        });
        fixture.detectChanges();

        // Assert
        expect(component.onNewAlert).not.toHaveBeenCalled();
    });

    it('#onNewAlert must be called it the alert is currently inactive', () => {
        // Arrange
        spyOn<any>(component, 'onNewAlert');
        component.canvasAlert.canShowAlert = false;

        // Act
        service.showNewAlert({
            canShowAlert: true,
            hasBeenSentByComponent: true,
            alert: 'New Alert',
        });
        fixture.detectChanges();

        // Assert
        expect(component.onNewAlert).toHaveBeenCalled();
    });

    it('#onNewAlert should call #removeAlert', () => {
        // Arrange
        spyOn<any>(component, 'removeAlert');
        const alert: CanvasAlert = {
            canShowAlert: true,
            alert: 'New Alert',
        };

        // Act
        component.onNewAlert(alert);

        // Assert
        expect(component['removeAlert']).toHaveBeenCalled();
    });

    it('#removeAlert should change #canShowAlert to #false', () => {
        // Arrange
        component.canvasAlert.canShowAlert = true;

        // Act
        jasmine.clock().install();
        component['removeAlert']();
        jasmine.clock().tick(ERROR_MESSAGE_DURATION);

        // Assert
        expect(component.canvasAlert.canShowAlert).toBeFalsy();

        jasmine.clock().uninstall();
    });
});
