import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Size {
    width: number;
    height: number;
}

export const CANVAS_SIZE_RATIO = 0.5;

@Injectable({
    providedIn: 'root',
})
export class WorkspaceService {
    private readonly newDrawingSize: Subject<Size>;

    width: number;
    height: number;
    workspace: ElementRef<HTMLDivElement>;

    constructor() {
        this.newDrawingSize = new Subject<Size>();
    }

    updateWorkspaceSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    updateDrawingSpaceSize(): void {
        this.newDrawingSize.next({ width: this.width * CANVAS_SIZE_RATIO, height: this.height * CANVAS_SIZE_RATIO });
    }

    getNewDrawingSize(): Observable<Size> {
        return this.newDrawingSize.asObservable();
    }

    setOverflow(value: string): void {
        this.workspace.nativeElement.style.overflow = value;
    }
}
