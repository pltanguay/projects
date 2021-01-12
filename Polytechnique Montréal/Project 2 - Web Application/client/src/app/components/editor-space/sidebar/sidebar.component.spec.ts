import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppModule } from '@app/app.module';
import { MaterialModule } from '@app/material.module';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { CarouselIconComponent } from './actions/carousel-icon/carousel-icon.component';
import { ExportDrawingComponent } from './actions/export-drawing/export-drawing.component';
import { NewDrawingComponent } from './actions/new-drawing/new-drawing.component';
import { SaveDrawingComponent } from './actions/save-drawing/save-drawing.component';
import { UndoRedoComponent } from './actions/undo-redo/undo-redo/undo-redo.component';
import { UserManualIconComponent } from './actions/user-manual-icon/user-manual-icon.component';
import { SidebarComponent } from './sidebar.component';
import { ToolIconGroupComponent } from './tool-icon-group/tool-icon-group.component';
import { ToolIconComponent } from './tool-icon/tool-icon.component';

// tslint:disable:no-any
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolService: jasmine.SpyObj<ToolSelectNotifierService>;

    beforeEach(async(() => {
        const tool = {
            ...jasmine.createSpyObj('Tool', ['']),
            isProcessing: true,
        };

        toolService = { ...jasmine.createSpyObj('ToolSelectNotifierService', ['selectTool']), currentTool: tool };

        TestBed.configureTestingModule({
            declarations: [
                SidebarComponent,
                ToolIconGroupComponent,
                ToolIconComponent,
                UndoRedoComponent,
                NewDrawingComponent,
                CarouselIconComponent,
                SaveDrawingComponent,
                ExportDrawingComponent,
                UserManualIconComponent,
            ],
            providers: [
                { provide: ToolSelectNotifierService, useValue: toolService },
                { provide: MatDialog, useValue: {} },
                { provide: HttpClient, useValue: {} },
            ],
            imports: [AppModule, MatDialogModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
