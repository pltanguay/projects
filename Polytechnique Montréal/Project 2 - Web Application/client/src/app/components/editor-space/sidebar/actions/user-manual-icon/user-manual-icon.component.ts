import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserManualComponent } from '@app/components/user-manual/user-manual.component';

@Component({
    selector: 'app-user-manual-icon',
    templateUrl: './user-manual-icon.component.html',
    styleUrls: ['./user-manual-icon.component.scss'],
})
export class UserManualIconComponent {
    toolTipText: string = "Guide de l'utilisateur";

    constructor(public userManualDialog: MatDialog) {}

    onClickAction(): void {
        this.userManualDialog.open(UserManualComponent, {
            panelClass: 'user-guide',
        });
    }
}
