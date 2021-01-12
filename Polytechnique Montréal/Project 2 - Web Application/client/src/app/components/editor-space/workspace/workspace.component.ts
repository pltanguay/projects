import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { WorkspaceService } from '@app/services/workspace/workspace.service';

const MIN_WORKSPACE_SIZE = 500;
@Component({
    selector: 'app-workspace',
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit, AfterViewInit {
    // static = true, because I need my ViewChild in ngOnInit()
    @ViewChild('workspace', { static: true }) workspaceContainer: ElementRef<HTMLDivElement>;

    workspaceWidth: number;
    workspaceHeight: number;
    constructor(private renderer: Renderer2, private workspaceService: WorkspaceService) {}
    ngOnInit(): void {
        this.setWorkspaceSize();
        this.workspaceService.updateWorkspaceSize(this.workspaceWidth, this.workspaceHeight);
        this.workspaceService.workspace = this.workspaceContainer;
    }

    ngAfterViewInit(): void {
        this.renderer.listen('window', 'resize', () => {
            this.setWorkspaceSize();
            this.workspaceService.updateWorkspaceSize(this.workspaceWidth, this.workspaceHeight);
        });
    }

    private setWorkspaceSize(): void {
        this.workspaceHeight = Math.max(MIN_WORKSPACE_SIZE, this.workspaceContainer.nativeElement.getBoundingClientRect().height);
        this.workspaceWidth = Math.max(MIN_WORKSPACE_SIZE, this.workspaceContainer.nativeElement.getBoundingClientRect().width);
    }
}
