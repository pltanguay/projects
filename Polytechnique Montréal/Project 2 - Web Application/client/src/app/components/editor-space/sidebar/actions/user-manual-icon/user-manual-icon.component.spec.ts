import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { UserManualIconComponent } from './user-manual-icon.component';

describe('UserManualIconComponent', () => {
    let component: UserManualIconComponent;
    let fixture: ComponentFixture<UserManualIconComponent>;
    let userGuideDialog: jasmine.SpyObj<MatDialog>;

    beforeEach(async(() => {
        userGuideDialog = jasmine.createSpyObj('MatDialog', ['open']);

        TestBed.configureTestingModule({
            declarations: [UserManualIconComponent],
            providers: [
                { provide: MatDialog, useValue: userGuideDialog },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
            imports: [MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserManualIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onClickAction should open user guide dialog', () => {
        // Arrange

        // Act
        component.onClickAction();

        // Assert
        expect(userGuideDialog.open).toHaveBeenCalled();
    });
});
