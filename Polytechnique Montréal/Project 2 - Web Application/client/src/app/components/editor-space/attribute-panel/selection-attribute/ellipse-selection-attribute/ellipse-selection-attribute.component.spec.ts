import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse-selection/ellipse-selection.service';
import { EllipseSelectionAttributeComponent } from './ellipse-selection-attribute.component';

describe('EllipseSelectionAttributeComponent', () => {
    let component: EllipseSelectionAttributeComponent;
    let fixture: ComponentFixture<EllipseSelectionAttributeComponent>;
    let ellipseSelectionService: jasmine.SpyObj<EllipseSelectionService>;

    beforeEach(async(() => {
        ellipseSelectionService = jasmine.createSpyObj('EllipseSelectionService', ['selectAll']);

        TestBed.configureTestingModule({
            declarations: [EllipseSelectionAttributeComponent],
            providers: [{ provide: EllipseSelectionService, useValue: ellipseSelectionService }],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseSelectionAttributeComponent);
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
        expect(ellipseSelectionService.selectAll).toHaveBeenCalled();
    });
});
