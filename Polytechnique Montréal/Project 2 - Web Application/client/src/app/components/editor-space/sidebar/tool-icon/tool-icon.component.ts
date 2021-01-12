import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToolType } from '@app/declarations/tool-declarations';
@Component({
    selector: 'app-tool-icon',
    templateUrl: './tool-icon.component.html',
    styleUrls: ['./tool-icon.component.scss'],
})
export class ToolIconComponent {
    @Input() icon: string;
    @Input() type: ToolType;
    @Input() isSelected: boolean;
    @Output()
    clickIcon: EventEmitter<ToolType> = new EventEmitter<ToolType>();

    onClickIcon(): void {
        this.clickIcon.emit(this.type);
    }
}
