import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle-selection/rectangle-selection.service';
import { RectangleSelectionAttributeComponent } from './rectangle-selection-attribute.component';

describe('RectangleSelectionAttributeComponent', () => {
    let component: RectangleSelectionAttributeComponent;
    let fixture: ComponentFixture<RectangleSelectionAttributeComponent>;
    let rectangleSelectionService: jasmine.SpyObj<RectangleSelectionService>;

    beforeEach(async(() => {
        rectangleSelectionService = jasmine.createSpyObj('RectangleSelectionService', ['selectAll']);

        TestBed.configureTestingModule({
            declarations: [RectangleSelectionAttributeComponent],
            providers: [{ provide: RectangleSelectionService, useValue: rectangleSelectionService }],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleSelectionAttributeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#selectAll should call rectangle tool selectAll', () => {
        // Arrange

        // Act
        component.selectAll();

        // Assert
        expect(rectangleSelectionService.selectAll).toHaveBeenCalled();
    });
});
