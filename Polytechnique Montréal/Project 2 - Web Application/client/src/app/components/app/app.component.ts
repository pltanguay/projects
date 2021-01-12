import { AfterViewInit, Component, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BrowserRefresh } from '@app/classes/utils/browser-refresh';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
    routerSubscription: Subscription;

    constructor(
        public renderer: Renderer2,
        private shortcutHandler: ShortcutHandlerService,
        private router: Router,
        private toolSelectService: ToolSelectNotifierService,
    ) {
        this.subscribeToRouter();
    }

    ngAfterViewInit(): void {
        this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
            this.shortcutHandler.dispatch(event);
        });
        this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
            this.toolSelectService.currentTool.onKeyDown(event);
        });
        this.renderer.listen('document', 'keyup', (event: KeyboardEvent) => {
            this.toolSelectService.currentTool.onKeyUp(event);
        });
    }

    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }

    subscribeToRouter(): void {
        this.routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.alertBrowserRefresh();
            }
        });
    }

    private alertBrowserRefresh(): void {
        BrowserRefresh.hasRefreshed = !this.router.navigated;
    }
}
