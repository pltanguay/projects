import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '@app/app.module';
import { Tool } from '@app/classes/tool/tool';
import { BrowserRefresh } from '@app/classes/utils/browser-refresh';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { ReplaySubject } from 'rxjs';
import { AppComponent } from './app.component';

// tslint:disable:no-any
// tslint:disable:no-string-literal

class ToolStub extends Tool {
    readonly type: ToolType = ToolType.Line;
}

const eventSubject = new ReplaySubject<RouterEvent>(1);

const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: eventSubject.asObservable(),
    url: 'editor-space',
    navigated: false,
};

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let matDialog: jasmine.SpyObj<MatDialog>;
    let shortcutServiceSpy: jasmine.SpyObj<ShortcutHandlerService>;
    let rendererSpy: jasmine.SpyObj<Renderer2>;
    let toolService: jasmine.SpyObj<ToolSelectNotifierService>;
    let browserspy: jasmine.SpyObj<BrowserRefresh>;

    beforeEach(async(() => {
        browserspy = jasmine.createSpyObj('BrowserRefresh', ['hasRefreshed']);
        matDialog = jasmine.createSpyObj('MatDialog', ['openDialogs']);
        shortcutServiceSpy = jasmine.createSpyObj('ShortcutHandlerService', ['dispatch']);
        rendererSpy = jasmine.createSpyObj('Renderer2', ['']);
        toolService = jasmine.createSpyObj('ToolSelectNotifierService', ['']);
        toolService.currentTool = new ToolStub({} as DrawingService);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, AppModule],
            declarations: [AppComponent],
            providers: [
                { provide: BrowserRefresh, useValue: browserspy },
                { provide: Router, useValue: routerMock },
                { provide: MatDialog, useValue: matDialog },
                { provide: Renderer2, useValue: rendererSpy },
                { provide: ShortcutHandlerService, useValue: shortcutServiceSpy },
                { provide: ToolSelectNotifierService, useValue: toolService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should call dispatch shortcut on keydown after view init', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.A });

        // Act
        document.dispatchEvent(event);

        // Assert
        expect(shortcutServiceSpy.dispatch).toHaveBeenCalled();
    });

    it(" should call the current tool's key down when receiving a document key down event", () => {
        // Arrange
        const event = new KeyboardEvent('keydown');
        const keyEventSpy = spyOn(toolService.currentTool, 'onKeyDown').and.callThrough();

        // Act
        document.dispatchEvent(event);

        // Assert
        expect(keyEventSpy).toHaveBeenCalled();
        expect(keyEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the current tool's key up when receiving a document key up event", () => {
        // Arrange
        const event = new KeyboardEvent('keyup');
        const keyEventSpy = spyOn(toolService.currentTool, 'onKeyUp').and.callThrough();

        // Act
        document.dispatchEvent(event);

        // Assert
        expect(keyEventSpy).toHaveBeenCalled();
        expect(keyEventSpy).toHaveBeenCalledWith(event);
    });

    it(' should not modify #hasBrowserBeenRefreshed if event is not navigation start', () => {
        // Arrange
        const spy = spyOn<any>(component, 'alertBrowserRefresh');

        // Act
        eventSubject.next(new NavigationEnd(1, 'ts', 'redirect'));

        // Assert
        expect(spy).not.toHaveBeenCalled();
    });

    it(' should modify #hasBrowserBeenRefreshed if event is navigation start', () => {
        // Arrange
        const spy = spyOn<any>(component, 'alertBrowserRefresh');

        // Act
        eventSubject.next(new NavigationStart(1, 'editor-space'));

        // Assert
        expect(spy).toHaveBeenCalled();
    });

    it(' #alertBrowserRefresh should toggle #BrowserRefresh', () => {
        // Arrange

        // Act
        eventSubject.next(new NavigationStart(1, 'editor-space'));

        // Assert
        expect(BrowserRefresh.hasRefreshed).toBe(true);
    });
});
