import { Component, EventEmitter, Output } from '@angular/core';
import { UserGuideItem } from '@app/classes/interfaces/user-guide';
import { TreeComponent } from '@app/components/user-manual/tree-component';
import { DRAWING_GUIDE_DATA } from '@app/declarations/drawing-tree-data';

@Component({
    selector: 'app-drawing-tree',
    templateUrl: './drawing-tree.component.html',
    styleUrls: ['./drawing-tree.component.scss'],
})
export class DrawingTreeComponent extends TreeComponent {
    @Output()
    drawingNode: EventEmitter<UserGuideItem> = new EventEmitter();

    constructor() {
        super();
        this.dataSource.data = DRAWING_GUIDE_DATA;
    }

    onNodeClick(node: UserGuideItem): void {
        this.drawingNode.emit(node);
    }
}
