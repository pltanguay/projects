import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ClipboardComponent } from './clipboard.component';

describe('ClipboardComponent', () => {
    let component: ClipboardComponent;
    let fixture: ComponentFixture<ClipboardComponent>;
    let selService: jasmine.SpyObj<SelectionService>;
    let clipboard: jasmine.SpyObj<ClipboardService>;

    beforeEach(async(() => {
        selService = { ...jasmine.createSpyObj('SelectionService', ['paste', 'delete']), selectionActive: true };
        clipboard = {
            ...jasmine.createSpyObj('ClipboardService', ['empty', 'disabled', 'copy', 'cut', 'delete', 'paste']),
            selectionService: selService,
        };
        TestBed.configureTestingModule({
            declarations: [ClipboardComponent],
            providers: [{ provide: ClipboardService, useValue: clipboard }],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClipboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#cut should cut service', () => {
        // Arrange

        // Act
        component.cut();

        // Assert
        expect(clipboard.cut).toHaveBeenCalled();
    });

    it('#copy should copy service', () => {
        // Arrange

        // Act
        component.copy();

        // Assert
        expect(clipboard.copy).toHaveBeenCalled();
    });

    it('#paste should paste service', () => {
        // Arrange

        // Act
        component.paste();

        // Assert
        expect(clipboard.paste).toHaveBeenCalled();
    });

    it('#delete should delete service', () => {
        // Arrange

        // Act
        component.delete();

        // Assert
        expect(clipboard.delete).toHaveBeenCalled();
    });
});
