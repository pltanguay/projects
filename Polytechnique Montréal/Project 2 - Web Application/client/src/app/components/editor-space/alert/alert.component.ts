import { Component, OnInit } from '@angular/core';
import { CanvasAlert } from '@app/classes/interfaces/canvas-alert';
import { AlertService } from '@app/services/alert/alert.service';

const ERROR_MESSAGE_DURATION = 2800;

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
    canvasAlert: CanvasAlert;

    constructor(private alertService: AlertService) {
        this.canvasAlert = { canShowAlert: false };
    }

    ngOnInit(): void {
        this.alertService.currentAlert.subscribe((alert) => {
            if (!alert.alert) return;

            this.canvasAlert.alert = alert.alert;
            if (this.canvasAlert.canShowAlert) return;

            if (alert.hasBeenSentByComponent) {
                this.onNewAlert(alert);
            }
        });
    }

    onNewAlert(event: CanvasAlert): void {
        this.canvasAlert = event;
        this.canvasAlert.canShowAlert = true;
        this.removeAlert();
    }

    private removeAlert(): void {
        setTimeout(() => {
            this.canvasAlert.canShowAlert = false;
        }, ERROR_MESSAGE_DURATION);
    }
}
