import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InitialMemento } from '@app/classes/undo-redo/memento/initial-memento';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { LocalStorageService } from '@app/services/local-storage/local-storage.service';
import { ResizeService } from '@app/services/resize/resize.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CanvasLoaderService {
    constructor(
        private localStorage: LocalStorageService,
        private resizeService: ResizeService,
        private canvasService: CanvasService,
        private router: Router,
    ) {}

    openDrawing(imageData: string): Observable<InitialMemento> {
        const subject: Subject<InitialMemento> = new Subject();

        this.getImage(imageData).subscribe((image: HTMLImageElement) => {
            this.resizeService.width = image.width;
            this.resizeService.height = image.height;
            this.resizeService.resize();
            this.canvasService.drawImage(image);
            this.localStorage.save();
            subject.next(new InitialMemento({ width: image.width, height: image.height }, this.canvasService.getImageData()));
        });

        this.router.navigateByUrl('/editor-space');
        return subject.asObservable();
    }

    getImage(imageData: string): Observable<HTMLImageElement> {
        return new Observable((observer) => {
            const image = new Image();
            image.onload = () => {
                observer.next(image);
                observer.complete();
            };
            image.src = imageData;
            image.onerror = null;
        });
    }
}
