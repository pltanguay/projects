import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppModule } from '@app/app.module';
import { MagicWandSelectionService } from '@app/services/tools/selection/magic-wand-selection/magic-wand-selection.service';
import { MagicWandSelectionAttributeComponent } from './magic-wand-selection-attribute.component';

describe('MagicWandSelectionAttributeComponent', () => {
    let component: MagicWandSelectionAttributeComponent;
    let fixture: ComponentFixture<MagicWandSelectionAttributeComponent>;
    let magicWandService: jasmine.SpyObj<MagicWandSelectionService>;

    beforeEach(async(() => {
        magicWandService = jasmine.createSpyObj('MagicWandSelectionService', ['selectAll']);
        TestBed.configureTestingModule({
            declarations: [MagicWandSelectionAttributeComponent],
            providers: [{ provide: MagicWandSelectionService, useValue: magicWandService }],
            imports: [AppModule, MatSnackBarModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MagicWandSelectionAttributeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#selectAll should call ellipse tool selectAll', () => {
        // Arrange

        // Act
        component.selectAll();

        // Assert
        expect(magicWandService.selectAll).toHaveBeenCalled();
    });
});
