import { ElementRef, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { SnapDirection, SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { SnapToGridComponent } from './snap-to-grid.component';

// tslint:disable:no-any
describe('SnapToGridComponent', () => {
    let component: SnapToGridComponent;
    let snapToGrid: jasmine.SpyObj<SnapToGridService>;
    let renderer: jasmine.SpyObj<Renderer2>;
    let fixture: ComponentFixture<SnapToGridComponent>;
    let svg: jasmine.SpyObj<SVGElement>;
    let svgEle: ElementRef<SVGElement>;

    beforeEach(async(() => {
        snapToGrid = { ...jasmine.createSpyObj('SnapToGridService', ['']), active: false, snapDirection: SnapDirection.TopLeft };
        renderer = jasmine.createSpyObj('Renderer2', ['setAttribute']);
        svg = jasmine.createSpyObj('SVGElement', ['setAttribute']);
        svgEle = new ElementRef<SVGElement>(svg);

        TestBed.configureTestingModule({
            declarations: [SnapToGridComponent],
            providers: [
                { provide: SnapToGridService, useValue: snapToGrid },
                { provide: Renderer2, useValue: renderer },
            ],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnapToGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#snapToGridToggle should toggle snaptogridservice active', () => {
        // Arrange
        const event = { checked: true } as MatSlideToggleChange;

        // Act
        component.snapToGridToggle(event);

        // Assert
        expect(snapToGrid.active).toBeTrue();
    });

    it('#afterViewInit should not set snap indicator index to 0 if already set', () => {
        // Arrange
        snapToGrid.snapIndicator = 1;

        // Act
        component.ngAfterViewInit();

        // Assert
        expect(snapToGrid.snapIndicator).not.toBe(0);
    });

    it('#indicatorClick should change selected circle fill attribute ', () => {
        // Arrange
        component.defaultIndicator = svgEle;
        spyOn<any>(component.renderer, 'setAttribute');

        // Act
        component.indicatorClick(0);

        // Assert
        expect(component.renderer.setAttribute).toHaveBeenCalled();
        expect(component.renderer.setAttribute).toHaveBeenCalledTimes(2);
    });

    it('#topLeft should set snapToGridService snap direction ', () => {
        // Arrange

        // Act
        component.topLeft();

        // Assert
        expect(snapToGrid.snapDirection).toEqual(SnapDirection.TopLeft);
    });

    it('#topCenter should set snapToGridService snap direction ', () => {
        // Arrange

        // Act
        component.topCenter();

        // Assert
        expect(snapToGrid.snapDirection).toEqual(SnapDirection.TopCenter);
    });
    it('#topRight should set snapToGridService snap direction ', () => {
        // Arrange

        // Act
        component.topRight();

        // Assert
        expect(snapToGrid.snapDirection).toEqual(SnapDirection.TopRight);
    });
    it('#centerLeft should set snapToGridService snap direction ', () => {
        // Arrange

        // Act
        component.centerLeft();

        // Assert
        expect(snapToGrid.snapDirection).toEqual(SnapDirection.CenterLeft);
    });
    it('#center should set snapToGridService snap direction ', () => {
        // Arrange

        // Act
        component.center();

        // Assert
        expect(snapToGrid.snapDirection).toEqual(SnapDirection.Center);
    });
    it('#centerRight should set snapToGridService snap direction ', () => {
        // Arrange

        // Act
        component.centerRight();

        // Assert
        expect(snapToGrid.snapDirection).toEqual(SnapDirection.CenterRight);
    });
    it('#bottomLeft should set snapToGridService snap direction ', () => {
        // Arrange

        // Act
        component.bottomLeft();

        // Assert
        expect(snapToGrid.snapDirection).toEqual(SnapDirection.BottomLeft);
    });
    it('#bottomCenter should set snapToGridService snap direction ', () => {
        // Arrange

        // Act
        component.bottomCenter();

        // Assert
        expect(snapToGrid.snapDirection).toEqual(SnapDirection.BottomCenter);
    });
    it('#bottomRight should set snapToGridService snap direction ', () => {
        // Arrange

        // Act
        component.bottomRight();

        // Assert
        expect(snapToGrid.snapDirection).toEqual(SnapDirection.BottomRight);
    });
});
