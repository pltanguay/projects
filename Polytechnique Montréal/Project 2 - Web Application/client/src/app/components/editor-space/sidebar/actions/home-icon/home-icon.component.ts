import { Component } from '@angular/core';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';

@Component({
    selector: 'app-home-icon',
    templateUrl: './home-icon.component.html',
    styleUrls: ['./home-icon.component.scss'],
})
export class HomeIconComponent {
    constructor(public toolSelectNotifier: ToolSelectNotifierService) {}
}
