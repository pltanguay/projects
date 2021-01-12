import { Component } from '@angular/core';
import { SidebarToolData } from '@app/classes/interfaces/sidebar-tool-data';
import { ToolType, TOOL_ICON_DRAW, TOOL_ICON_SELECTION, TOOL_ICON_SHAPE, TOOL_ICON_UTILS } from '@app/declarations/tool-declarations';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
@Component({
    selector: 'app-tool-icon-group',
    templateUrl: './tool-icon-group.component.html',
    styleUrls: ['./tool-icon-group.component.scss'],
})
export class ToolIconGroupComponent {
    readonly TOOL_ICON_DRAW: SidebarToolData[];
    readonly TOOL_ICON_SHAPE: SidebarToolData[];
    readonly TOOL_ICON_SELECTION: SidebarToolData[];
    readonly TOOL_ICON_UTILS: SidebarToolData[];

    constructor(private toolSelectService: ToolSelectNotifierService) {
        this.TOOL_ICON_DRAW = TOOL_ICON_DRAW;
        this.TOOL_ICON_SHAPE = TOOL_ICON_SHAPE;
        this.TOOL_ICON_SELECTION = TOOL_ICON_SELECTION;
        this.TOOL_ICON_UTILS = TOOL_ICON_UTILS;
    }

    get currentSelectedTool(): ToolType {
        return this.toolSelectService.currentTool.type;
    }

    onClickIcon(toolType: ToolType): void {
        this.toolSelectService.selectTool(toolType);
    }
}
