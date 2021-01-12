import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanvasAlert } from '@app/classes/interfaces/canvas-alert';
import { BehaviorSubject, Observable } from 'rxjs';

export const ALERT_DURATION = 3000;
@Injectable({
    providedIn: 'root',
})
export class AlertService {
    private alertSource: BehaviorSubject<CanvasAlert>;
    currentAlert: Observable<CanvasAlert>;

    constructor(public snackBarAlert: MatSnackBar) {
        this.alertSource = new BehaviorSubject({ canShowAlert: false });
        this.currentAlert = this.alertSource.asObservable();
    }

    showNewAlert(newAlert: CanvasAlert): void {
        this.alertSource.next(newAlert);
    }

    showSnackBarAlert(message: string): void {
        this.snackBarAlert.open(message, 'OK', { duration: ALERT_DURATION });
    }
}
