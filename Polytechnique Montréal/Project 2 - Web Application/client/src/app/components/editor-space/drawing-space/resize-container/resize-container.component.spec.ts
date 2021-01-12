import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { MouseData } from '@app/classes/interfaces/mousedata';
import { ResizeMemento } from '@app/classes/undo-redo/memento/resize-memento';
import { ResizeService } from '@app/services/resize/resize.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { ResizeContainerComponent } from './resize-container.component';

// tslint:disable:no-magic-numbers
describe('ResizeContainerComponent', () => {
    let component: ResizeContainerComponent;
    let fixture: ComponentFixture<ResizeContainerComponent>;
    let resizeService: jasmine.SpyObj<ResizeService>;
    let snapShotFactory: jasmine.SpyObj<SnapshotFactoryService>;

    beforeEach(async(() => {
        resizeService = jasmine.createSpyObj('ResizeService', ['updateWidthSize', 'updateHeightSize', 'resize']);
        resizeService.width = 0;
        resizeService.height = 0;

        snapShotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);

        TestBed.configureTestingModule({
            declarations: [ResizeContainerComponent],
            providers: [
                { provide: ResizeService, useValue: resizeService },
                { provide: SnapshotFactoryService, useValue: snapShotFactory },
            ],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResizeContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('border should be hidden on creation', () => {
        // Arrange

        // Act

        // Assert
        expect(component.resizeableBorderHidden).toBeTrue();
    });

    it('#resizeRightChange event should call resize service updateWidthSize', () => {
        // Arrange
        const event = {} as MouseData;

        // Act
        component.resizeRightChange(event);

        // Assert
        expect(resizeService.updateWidthSize).toHaveBeenCalled();
        expect(resizeService.updateWidthSize).toHaveBeenCalledWith(event);
    });

    it('#resizeBottomChange event should call resize service updateHeightSize', () => {
        // Arrange
        const event = {} as MouseData;

        // Act
        component.resizeBottomChange(event);

        // Assert
        expect(resizeService.updateHeightSize).toHaveBeenCalled();
        expect(resizeService.updateHeightSize).toHaveBeenCalledWith(event);
    });

    it('#resizeDiagonalChange event should call resize service updateHeightSize and updateWidthSize', () => {
        // Arrange
        const event = {} as MouseData;

        // Act
        component.resizeDiagonalChange(event);

        // Assert
        expect(resizeService.updateHeightSize).toHaveBeenCalled();
        expect(resizeService.updateHeightSize).toHaveBeenCalledWith(event);
        expect(resizeService.updateWidthSize).toHaveBeenCalled();
        expect(resizeService.updateWidthSize).toHaveBeenCalledWith(event);
    });

    it('should show border when resize border is dragged (#resizeDragged) ', () => {
        // Arrange

        // Act
        component.resizeDragged();

        // Assert
        expect(component.resizeableBorderHidden).toBeFalse();
    });

    it('should emit is dragged event when dragged on #resizeDragged) ', () => {
        // Arrange
        spyOn(component.isDragged, 'emit');

        // Act
        component.resizeDragged();

        // Assert
        expect(component.isDragged.emit).toHaveBeenCalled();
        expect(component.isDragged.emit).toHaveBeenCalledWith(true);
    });

    it('should hide the border when resize border is released (#resizeReleased)', () => {
        // Arrange

        // Act
        component.resizeReleased();
        fixture.detectChanges();

        // Assert
        expect(component.resizeableBorderHidden).toBeTrue();
    });

    it('should call resize service on #resizeReleased ', () => {
        // Act
        component.resizeReleased();

        // Assert
        expect(resizeService.resize).toHaveBeenCalled();
    });

    it('should save snapchot on #resizeReleased', () => {
        // Arrange
        const resizeMemento = new ResizeMemento(0, 0);
        // Act
        component.resizeReleased();

        // Assert
        expect(snapShotFactory.save).toHaveBeenCalled();
        expect(snapShotFactory.save).toHaveBeenCalledWith(resizeMemento);
    });

    it('should emit is dragged event when dragged on #resizeReleased', () => {
        // Arrange
        spyOn(component.isDragged, 'emit');

        // Act
        component.resizeReleased();

        // Assert
        expect(component.isDragged.emit).toHaveBeenCalled();
        expect(component.isDragged.emit).toHaveBeenCalledWith(false);
    });
});
