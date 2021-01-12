import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-attribute-panel',
    templateUrl: './attribute-panel.component.html',
    styleUrls: ['./attribute-panel.component.scss'],
})
export class AttributePanelComponent implements OnInit, OnDestroy {
    private toolSubscription: Subscription;
    selectedPanel: Type<AbsAttributeDirective>;
    isPanelOpen: boolean;

    constructor(private toolService: ToolSelectNotifierService) {
        this.selectedPanel = this.toolService.getInitialToolPanel();
        this.isPanelOpen = true;
    }

    ngOnInit(): void {
        this.toolSubscription = this.toolService.getToolPanel().subscribe((selectedPanel: Type<AbsAttributeDirective>) => {
            if (this.selectedPanel === selectedPanel) this.togglePanel();
            if (!this.isPanelOpen && this.selectedPanel !== selectedPanel) this.togglePanel();
            this.selectedPanel = selectedPanel;
        });
    }

    ngOnDestroy(): void {
        this.toolSubscription.unsubscribe();
    }

    togglePanel(): void {
        this.isPanelOpen = !this.isPanelOpen;
    }
}
