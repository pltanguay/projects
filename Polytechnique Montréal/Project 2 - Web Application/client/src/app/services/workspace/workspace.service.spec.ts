import { ElementRef } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Size } from '@app/services/workspace/workspace.service';
import { Subject } from 'rxjs';
import { CANVAS_SIZE_RATIO, WorkspaceService } from './workspace.service';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
describe('WorkspaceService', () => {
    let service: WorkspaceService;
    let div: HTMLDivElement;
    let workspace: ElementRef<HTMLDivElement>;

    div = document.createElement('div');
    workspace = new ElementRef(div);

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WorkspaceService);
        service.workspace = workspace;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#updateWorkspaceSize should set #width and #height', () => {
        // Arrange
        const width = 1000;
        const height = 1200;

        // Act
        service.updateWorkspaceSize(width, height);

        // Assert
        expect(service.width).toBe(width);
        expect(service.height).toBe(height);
    });

    it('#getNewDrawingSize should return an observable', () => {
        // Arrange
        const subject = new Subject<Size>();
        const expectedObs = subject.asObservable();

        // Act
        const gotObs = service.getNewDrawingSize();

        // Assert
        expect(gotObs).toEqual(expectedObs);
    });

    it('#updateDrawingSpaceSize should emit new drawing size ', fakeAsync(() => {
        // Arrange
        service.width = 600;
        service.height = 800;
        const expectedSize = { width: 600 * CANVAS_SIZE_RATIO, height: 800 * CANVAS_SIZE_RATIO };
        let retSize: Size = { width: 0, height: 0 };

        service.getNewDrawingSize().subscribe((size: Size) => {
            retSize = size;
        });

        // Act
        service.updateDrawingSpaceSize();
        tick();

        // Assert
        expect(retSize).toEqual(expectedSize);
    }));

    it('#setOverflow should change workspace overflow style', () => {
        // Arrange
        const overflow = 'hidden';

        // Act
        service.setOverflow(overflow);

        // Assert
        expect(service.workspace.nativeElement.style.overflow).toBe(overflow);
    });
});
