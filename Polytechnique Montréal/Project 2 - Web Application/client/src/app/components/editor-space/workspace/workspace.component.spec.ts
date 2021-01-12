import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { WorkspaceService } from '@app/services/workspace/workspace.service';
import { of } from 'rxjs';
import { WorkspaceComponent } from './workspace.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('WorkspaceComponent', () => {
    let component: WorkspaceComponent;
    let fixture: ComponentFixture<WorkspaceComponent>;
    let workspaceService: jasmine.SpyObj<WorkspaceService>;
    let MIN_WORKSPACE_SIZE: number;

    // tslint:disable:no-magic-numbers
    beforeEach(async(() => {
        MIN_WORKSPACE_SIZE = 500;

        workspaceService = jasmine.createSpyObj('WorkspaceService', ['updateWorkspaceSize', 'getNewDrawingSize']);
        workspaceService.getNewDrawingSize.and.returnValue(of({ width: 10, height: 10 }));
        TestBed.configureTestingModule({
            declarations: [WorkspaceComponent],
            providers: [{ provide: WorkspaceService, useValue: workspaceService }],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkspaceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#workspaceWidth should be equal to workspace width after calling #setWorkspaceSize', () => {
        // Arrange
        const width = 800;
        const size = new DOMRect(0, 0, width, 0);
        spyOn(component.workspaceContainer.nativeElement, 'getBoundingClientRect').and.returnValue(size);

        // Act
        fixture.detectChanges();
        component['setWorkspaceSize']();

        // Assert
        expect(component.workspaceWidth).toBe(width);
    });

    it('#workspaceHeight should be equal to workspace height after calling #setWorkspaceSize', () => {
        // Arrange
        const height = 700;
        const size = new DOMRect(0, 0, 0, height);
        spyOn(component.workspaceContainer.nativeElement, 'getBoundingClientRect').and.returnValue(size);

        // Act
        fixture.detectChanges();
        component['setWorkspaceSize']();

        // Assert
        expect(component.workspaceHeight).toBe(height);
    });

    it('#workspaceWidth should be equal to #MIN_WORKSPACE_SIZE if workspace width is smaller than 500', () => {
        // Arrange
        const width = 100;
        const size = new DOMRect(0, 0, width, 0);
        spyOn(component.workspaceContainer.nativeElement, 'getBoundingClientRect').and.returnValue(size);

        // Act
        fixture.detectChanges();
        component['setWorkspaceSize']();

        // Assert
        expect(component.workspaceWidth).toBe(MIN_WORKSPACE_SIZE);
    });

    it('#workspaceHeight should be equal to #MIN_WORKSPACE_SIZE if workspace height is smaller than 500', () => {
        // Arrange
        const height = 499;
        const size = new DOMRect(0, 0, height, 0);
        spyOn(component.workspaceContainer.nativeElement, 'getBoundingClientRect').and.returnValue(size);

        // Act
        fixture.detectChanges();
        component['setWorkspaceSize']();

        // Assert
        expect(component.workspaceHeight).toBe(MIN_WORKSPACE_SIZE);
    });

    it('should call #setWorkspaceSize after window has been resized', () => {
        // Arrange

        // Act
        window.dispatchEvent(new Event('resize'));
        fixture.detectChanges();

        // Assert
        expect(workspaceService.updateWorkspaceSize).toHaveBeenCalled();
    });

    it('should call workspace service after window has been resized', () => {
        // Arrange
        // Act
        window.dispatchEvent(new Event('resize'));
        fixture.detectChanges();

        // Assert
        expect(workspaceService.updateWorkspaceSize).toHaveBeenCalled();
    });

    it('should call #setWorkspaceSize on init', () => {
        // Arrange
        spyOn<any>(component, 'setWorkspaceSize');

        // Act
        component.ngOnInit();
        fixture.detectChanges();

        // Assert
        expect(component['setWorkspaceSize']).toHaveBeenCalled();
    });

    it('should call workspace service on init', () => {
        // Arrange

        // Act
        component.ngOnInit();
        fixture.detectChanges();

        // Assert
        expect(workspaceService.updateWorkspaceSize).toHaveBeenCalled();
    });
});
