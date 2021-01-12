import { Component, EventEmitter, Output } from '@angular/core';
import { UserGuideItem } from '@app/classes/interfaces/user-guide';
import { TreeComponent } from '@app/components/user-manual/tree-component';
import { DIVERSE_GUIDE_DATA } from '@app/declarations/diverse-tree-data';

@Component({
    selector: 'app-diverse-tree',
    templateUrl: './diverse-tree.component.html',
    styleUrls: ['./diverse-tree.component.scss'],
})
export class DiverseTreeComponent extends TreeComponent {
    @Output()
    diverseNode: EventEmitter<UserGuideItem> = new EventEmitter();

    constructor() {
        super();
        this.dataSource.data = DIVERSE_GUIDE_DATA;
    }

    onNodeClick(node: UserGuideItem): void {
        this.diverseNode.emit(node);
    }
}
