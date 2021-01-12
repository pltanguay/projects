import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { GridCanvasComponent } from './grid-canvas.component';

// tslint:disable:no-string-literal
describe('GridCanvasComponent', () => {
    let component: GridCanvasComponent;
    let fixture: ComponentFixture<GridCanvasComponent>;
    let canvasServiceSpy: jasmine.SpyObj<CanvasService>;

    beforeEach(async(() => {
        canvasServiceSpy = jasmine.createSpyObj('CanvasService', ['createGrid']);

        TestBed.configureTestingModule({
            declarations: [GridCanvasComponent],
            providers: [{ provide: CanvasService, useValue: canvasServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridCanvasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
