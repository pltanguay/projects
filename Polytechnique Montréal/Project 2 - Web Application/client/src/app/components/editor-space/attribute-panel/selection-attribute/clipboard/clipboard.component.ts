import { Component } from '@angular/core';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';

export const CLIPBOARD_ID = 'clipboard-actions';
@Component({
    selector: 'app-clipboard',
    templateUrl: './clipboard.component.html',
    styleUrls: ['./clipboard.component.scss'],
})
export class ClipboardComponent {
    constructor(public clipboard: ClipboardService) {}
    copy(): void {
        this.clipboard.copy();
    }

    paste(): void {
        this.clipboard.paste();
    }
    cut(): void {
        this.clipboard.cut();
    }

    delete(): void {
        this.clipboard.delete();
    }
}
