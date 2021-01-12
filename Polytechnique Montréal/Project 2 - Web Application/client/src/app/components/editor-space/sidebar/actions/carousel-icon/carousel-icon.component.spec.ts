import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { of } from 'rxjs';
import { CarouselIconComponent } from './carousel-icon.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('CarouselIconComponent', () => {
    let component: CarouselIconComponent;
    let fixture: ComponentFixture<CarouselIconComponent>;
    let matDialog: jasmine.SpyObj<MatDialog>;
    let shortcutHandler: jasmine.SpyObj<ShortcutHandlerService>;

    let spyDialogRef: any;

    beforeEach(async(() => {
        spyDialogRef = jasmine.createSpy();
        spyDialogRef.afterClosed = () => of(true);

        matDialog = { ...jasmine.createSpyObj('MatDialog', ['open']), openDialogs: { length: 2 } } as jasmine.SpyObj<MatDialog>;
        matDialog.open.and.returnValue(spyDialogRef);

        shortcutHandler = jasmine.createSpyObj('ShortcutHandlerService', ['register']);

        TestBed.configureTestingModule({
            declarations: [CarouselIconComponent],
            providers: [
                { provide: MatDialog, useValue: matDialog },
                { provide: ShortcutHandlerService, useValue: shortcutHandler },
            ],
            imports: [MatDialogModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarouselIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onClickAction should open mat dialog', () => {
        // Arrange

        // Act
        component.onClickAction();

        // Assert
        expect(matDialog.open).toHaveBeenCalled();
    });

    it('#shortcutCarouselAction should call #onClickAction if openDialog length is above 0', () => {
        // Arrange
        spyOn<any>(component, 'onClickAction');

        // Act
        component['shortcutCarouselAction']();

        // Assert
        expect(component.onClickAction).not.toHaveBeenCalled();
    });

    it('#shortcutCarouselAction should call #onClickAction if openDialog length is less or equal 0', () => {
        // Arrange
        const spy = spyOn<any>(component, 'onClickAction');
        spyOn<any>(matDialog, 'openDialogs').and.returnValue({ length: 0 });

        // Act
        component['shortcutCarouselAction']();

        // Assert
        expect(spy).toHaveBeenCalled();
    });
});
