import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Pencil } from '@app/classes/base-trace/pencil/pencil';
import { PencilService } from './pencil-service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
describe('PencilService', () => {
    let service: PencilService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(PencilService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create a new Pencil Trace on #newTrace', () => {
        // Arrange
        service.width = 50;
        service.color = '#ffeedd';
        const expectedPencil = new Pencil(service.width, service.color);

        // Act
        service['newTrace']();

        // Assert
        expect(service.currentTrace).toEqual(expectedPencil);
    });
});
