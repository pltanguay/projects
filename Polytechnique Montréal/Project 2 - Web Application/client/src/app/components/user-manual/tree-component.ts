import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { UserGuideItem } from '@app/classes/interfaces/user-guide';

export class TreeComponent {
    treeControl: NestedTreeControl<UserGuideItem>;
    dataSource: MatTreeNestedDataSource<UserGuideItem>;

    protected getNodeSubtitle: (node: UserGuideItem) => UserGuideItem[] | undefined = (node: UserGuideItem) => node.subtitle;

    constructor() {
        this.treeControl = new NestedTreeControl<UserGuideItem>(this.getNodeSubtitle);
        this.dataSource = new MatTreeNestedDataSource<UserGuideItem>();
    }

    hasChild = (_: number, node: UserGuideItem) => !!node.subtitle && node.subtitle.length > 0;
}
