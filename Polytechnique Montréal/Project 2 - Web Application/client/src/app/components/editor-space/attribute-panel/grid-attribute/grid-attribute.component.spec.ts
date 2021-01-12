import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { ColorService } from '@app/services/tools/color/color.service';
import { GridService } from '@app/services/tools/grid-service/grid.service';
import { GridAttributeComponent } from './grid-attribute.component';

describe('GridAttributeComponent', () => {
    let component: GridAttributeComponent;
    let fixture: ComponentFixture<GridAttributeComponent>;
    const componentTitle = 'Grille';
    let gridService: jasmine.SpyObj<GridService>;
    let colorService: jasmine.SpyObj<ColorService>;

    // tslint:disable:no-magic-numbers
    // tslint:disable:no-string-literal
    // tslint:disable:no-any

    beforeEach(async(() => {
        gridService = jasmine.createSpyObj('GridService', ['calculateArray', 'drawGrid']);

        gridService.isActive = false;
        gridService.opacity = 0.6;
        gridService.squareSize = 100;

        colorService = jasmine.createSpyObj('ColorService', ['getColorsObservable']);

        TestBed.configureTestingModule({
            declarations: [GridAttributeComponent],
            providers: [
                { provide: GridService, useValue: gridService },
                { provide: ColorService, useValue: colorService },
            ],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridAttributeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Grille"', () => {
        // Arrange

        // Act

        // Assert
        expect(component.title).toBe(componentTitle);
    });

    it('should get grid attribute from grid service', () => {
        // Arrange

        // Act
        component.ngOnInit();

        // Assert
        expect(component.opacity).toBe(gridService.opacity * 100);
    });

    it('should set all grid attributes after component initialized from grid service', () => {
        // Arrange

        // Act
        component.ngOnInit();

        // Assert
        expect(component.opacity).toBe(component.gridService.opacity * 100);
    });

    it('#isActiveChanged should set grid #isActive', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: true };

        // Act
        component.isActiveChanged(event);

        // Assert
        expect(gridService.isActive).toBe(true);
        expect(gridService.drawGrid).toHaveBeenCalled();
    });

    it('#opacityChanged should set grid #opacity', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 39 };

        // Act
        component.opacityChanged(event);

        // Assert
        expect(gridService.opacity).toBe(39 / 100);
        expect(gridService.drawGrid).toHaveBeenCalled();
    });

    it('#squareSizeChanged should set grid #squareSize', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 200 };

        // Act
        component.squareSizeChanged(event);

        // Assert
        expect(gridService.squareSize).toBe(200);
        expect(gridService.drawGrid).toHaveBeenCalled();
    });
});
