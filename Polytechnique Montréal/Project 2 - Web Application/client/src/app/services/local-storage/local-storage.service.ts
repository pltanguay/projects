import { Injectable } from '@angular/core';
import { AlertType } from '@app/classes/interfaces/canvas-alert';
import { AlertService } from '@app/services/alert/alert.service';
import { CanvasService } from '@app/services/canvas/canvas.service';

const STORAGE_KEY = 'TsPaint-drawing';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor(private canvasService: CanvasService, private alertService: AlertService) {}

    save(): void {
        if (!this.canvasService.isEmpty) this.showAlert();
        const data: string = this.canvasService.canvas.toDataURL();
        localStorage.setItem(STORAGE_KEY, data);
    }

    getItem(): string | null {
        return localStorage.getItem(STORAGE_KEY);
    }

    private showAlert(): void {
        this.alertService.showNewAlert({
            canShowAlert: true,
            hasBeenSentByComponent: true,
            type: AlertType.ChangesSaved,
            alert: 'Dessin sauvegardé',
        });
    }
}
