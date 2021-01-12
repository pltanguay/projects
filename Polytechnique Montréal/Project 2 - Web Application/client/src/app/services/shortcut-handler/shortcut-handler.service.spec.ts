import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CircularBuffer } from '@app/classes/utils/ring-buffer';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { Shortcut } from '@app/services/shortcut-handler/shortcut';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { GridService } from '@app/services/tools/grid-service/grid.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { DrawingData } from '@common/communication/drawing-data';
import { ShortcutHandlerService } from './shortcut-handler.service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
// tslint:disable:no-empty
// tslint:disable:no-magic-numbers
// tslint:disable:max-file-line-count

@Component({ selector: 'app-carousel', template: ' ' })
class CarouselComponent {}

const N_SHORTCUTS = 28;

describe('ShortcutHandlerService', () => {
    let service: ShortcutHandlerService;
    let matDialog: jasmine.SpyObj<MatDialog>;
    let toolService: jasmine.SpyObj<ToolSelectNotifierService>;
    let undoRedoService: jasmine.SpyObj<UndoRedoService>;
    let carouselService: jasmine.SpyObj<CarouselService>;
    let clipboard: jasmine.SpyObj<ClipboardService>;
    let snapGrid: jasmine.SpyObj<SnapToGridService>;
    let gridService: jasmine.SpyObj<GridService>;
    let spyIsWriting: any;

    beforeEach(() => {
        matDialog = {
            ...jasmine.createSpyObj('MatDialog', ['']),
            openDialogs: [],
        };
        toolService = jasmine.createSpyObj('ToolSelectNotifierService', ['selectTool', 'isWritingInTextTool']);
        undoRedoService = jasmine.createSpyObj('UndoRedoService', ['undo', 'redo']);
        snapGrid = jasmine.createSpyObj('SnapToGridService', ['getNearestPointTranslation', 'getArrowTranslationPoint', 'toggle']);
        gridService = { ...jasmine.createSpyObj('GridService', ['drawGrid', 'increaseSquareSize', 'decreaseSquareSize']), isActive: true };

        const drawings = new CircularBuffer<DrawingData>();
        drawings.add([{}, {}, {}, {}] as any);
        carouselService = { ...jasmine.createSpyObj('CarouselService', ['next', 'previous']), drawings };

        clipboard = jasmine.createSpyObj('ClipboardService', ['cut', 'copy', 'paste', 'delete']);

        service = new ShortcutHandlerService(toolService, undoRedoService, carouselService, matDialog, clipboard, snapGrid, gridService);

        spyIsWriting = toolService.isWritingInTextTool.and.returnValue(false);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#register should set shortcut in #shortcuts map', () => {
        // Arrange
        const sh = new Shortcut(Keyboard.A);
        const cb = () => {
            return;
        };
        spyOn<any>(service['shortcuts'], 'set');

        // Act
        service.register(sh, cb);

        // Assert
        expect(service['shortcuts'].set).toHaveBeenCalled();
    });

    it('#dispatch should stop when we are currently writing a text', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.A, repeat: false, ctrlKey: true, shiftKey: true });
        spyOn(event, 'preventDefault');

        spyIsWriting.and.returnValue(true);

        // Act
        service.dispatch(event);

        // Assert
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('#dispatch should stop when key is repeated', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.A, repeat: true, ctrlKey: false });
        spyOn(event, 'preventDefault');

        // Act
        service.dispatch(event);

        // Assert
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('#dispatch should prevent default if ctrl or shift key pressed', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.A, repeat: false, ctrlKey: true, shiftKey: true });
        spyOn(event, 'preventDefault');

        // Act
        service.dispatch(event);

        // Assert
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('#dispatch should do nothing if a dialog is already opened and espace key not pressed', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.A, repeat: false, ctrlKey: false, shiftKey: false });
        spyOn(service['shortcuts'], 'get');
        Object.defineProperty(matDialog.openDialogs, 'length', { value: 1 });

        // Act
        service.dispatch(event);

        // Assert
        expect(service['shortcuts'].get).not.toHaveBeenCalled();
    });

    it('#dispatch should call shortcut callback on valid key', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.A, repeat: false, ctrlKey: false, shiftKey: false });
        spyOn(service['shortcuts'], 'get');
        service['shortcuts'].set(new Shortcut(Keyboard.A), () => {});

        // Act
        service.dispatch(event);

        // Assert
        expect(service['shortcuts'].get).toHaveBeenCalled();
    });

    it('#registerShortcuts should register service shortcuts', () => {
        // Arrange
        spyOn(service['shortcuts'], 'set');

        // Act
        service['registerShortcuts']();

        // Assert
        expect(service['shortcuts'].set).toHaveBeenCalledTimes(N_SHORTCUTS);
    });

    it('#dispatch with C should select pencil', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.C, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.Pencil);
    });

    it('#dispatch with T should select text', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.T, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.Text);
    });
    it('#dispatch with V should select magic wand', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.V, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.MagicWandSelection);
    });
    it('#dispatch with P should select feather pen', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.P, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.FeatherPen);
    });

    it('#dispatch with D should select feather pen', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.D, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.Stamp);
    });

    it('#dispatch with W should select brush', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.W, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.Brush);
    });

    it('#dispatch with E should select eraser', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.E, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.Eraser);
    });

    it('#dispatch with A should select spray', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.A, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.Spray);
    });

    it('#dispatch with 1 should select rectangle', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.Digit_1, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.Rectangle);
    });

    it('#dispatch with 2 should select ellipse', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.Digit_2, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.Ellipse);
    });

    it('#dispatch with 3 should select polygone', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.Digit_3, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.Polygone);
    });

    it('#dispatch with L should select line', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.L, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.Line);
    });

    it('#dispatch with P should select featherPen', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.P, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.FeatherPen);
    });

    it('#dispatch with R should select rectangle selection', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.R, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.RectangleSelection);
    });

    it('#dispatch with S should select ellipse selection', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.S, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.EllipseSelection);
    });

    it('#dispatch with B should select bucket', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.B, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.Bucket);
    });

    it('#dispatch with I should select color picker', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.I, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.ColorPicker);
    });

    it('#dispatch with I should select color picker', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.I, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
        expect(toolService.selectTool).toHaveBeenCalledWith(ToolType.ColorPicker);
    });

    it('#dispatch with Ctrl-Z should call undo service', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.Z, repeat: false, ctrlKey: true, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(undoRedoService.undo).toHaveBeenCalled();
    });

    it('#dispatch with Ctrl-Shift-Z should call undo service', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.Z, repeat: false, ctrlKey: true, shiftKey: true });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(undoRedoService.redo).toHaveBeenCalled();
    });

    it('#dispatch with left arrow should call carousel service previous', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.LEFT_ARROW, repeat: false, ctrlKey: false, shiftKey: false });
        Object.defineProperty(matDialog, 'openDialogs', { value: [{ componentInstance: CarouselComponent } as any] });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(carouselService.previous).toHaveBeenCalled();
    });

    it('#dispatch with right arrow should call carousel service next', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.RIGHT_ARROW, repeat: false, ctrlKey: false, shiftKey: false });
        Object.defineProperty(matDialog, 'openDialogs', { value: [{ componentInstance: CarouselComponent } as any] });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(carouselService.next).toHaveBeenCalled();
    });

    it('#dispatch with left arrow should not call carousel service previous if carousel dialog is not open', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.LEFT_ARROW, repeat: false, ctrlKey: false, shiftKey: false });
        Object.defineProperty(matDialog, 'openDialogs', { value: [{ componentInstance: undefined } as any] });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(carouselService.previous).not.toHaveBeenCalled();
    });

    it('#dispatch with right arrow should not call carousel service next  if carousel dialog is not open', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.RIGHT_ARROW, repeat: false, ctrlKey: false, shiftKey: false });
        Object.defineProperty(matDialog, 'openDialogs', { value: [{ componentInstance: undefined } as any] });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(carouselService.next).not.toHaveBeenCalled();
    });

    it('#dispatch with left arrow should not call carousel service previous if carousel dialog is undefined', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.LEFT_ARROW, repeat: false, ctrlKey: false, shiftKey: false });
        Object.defineProperty(matDialog, 'openDialogs', { value: [] });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(carouselService.previous).not.toHaveBeenCalled();
    });

    it('#dispatch with right arrow should not call carousel service next  if dialog is undefined', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.RIGHT_ARROW, repeat: false, ctrlKey: false, shiftKey: false });
        Object.defineProperty(matDialog, 'openDialogs', { value: [] });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(carouselService.next).not.toHaveBeenCalled();
    });

    it('#dispatch with G should call drawGrid', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.G, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(gridService.drawGrid).toHaveBeenCalled();
    });

    it('#dispatch with MINUS should decrease grid squares', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.MINUS, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(gridService.decreaseSquareSize).toHaveBeenCalled();
    });

    it('#dispatch with PLUS should increase grid squares', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.PLUS, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(gridService.increaseSquareSize).toHaveBeenCalled();
    });

    it('#dispatch with Ctrl+C should call copy', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.C, repeat: false, ctrlKey: true, shiftKey: false });
        Object.defineProperty(toolService, 'currentTool', { value: { type: ToolType.RectangleSelection } });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(clipboard.copy).toHaveBeenCalled();
    });

    it('#dispatch with Ctrl+V should call paste', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.V, repeat: false, ctrlKey: true, shiftKey: false });
        Object.defineProperty(toolService, 'currentTool', { value: { type: ToolType.RectangleSelection } });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(clipboard.paste).toHaveBeenCalled();
    });

    it('#dispatch with Ctrl+X should call cut', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.X, repeat: false, ctrlKey: true, shiftKey: false });
        Object.defineProperty(toolService, 'currentTool', { value: { type: ToolType.RectangleSelection } });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(clipboard.cut).toHaveBeenCalled();
    });

    it('#dispatch with DEL should call delete', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.DEL, repeat: false, ctrlKey: false, shiftKey: false });
        Object.defineProperty(toolService, 'currentTool', { value: { type: ToolType.RectangleSelection } });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(clipboard.delete).toHaveBeenCalled();
    });

    it('#dispatch with Ctrl+C should not call copy if current tool is not selection', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.C, repeat: false, ctrlKey: true, shiftKey: false });
        Object.defineProperty(toolService, 'currentTool', { value: { type: ToolType.Pencil } });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(clipboard.copy).not.toHaveBeenCalled();
    });

    it('#dispatch with Ctrl+V should not call paste if current tool is not selection', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.V, repeat: false, ctrlKey: true, shiftKey: false });
        Object.defineProperty(toolService, 'currentTool', { value: { type: ToolType.Pencil } });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(clipboard.paste).not.toHaveBeenCalled();
    });

    it('#dispatch with Ctrl+X should not call cut if current tool is not selection', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.X, repeat: false, ctrlKey: true, shiftKey: false });
        Object.defineProperty(toolService, 'currentTool', { value: { type: ToolType.Pencil } });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(clipboard.cut).not.toHaveBeenCalled();
    });

    it('#dispatch with DEL should not call delete if current tool is not selection', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.DEL, repeat: false, ctrlKey: false, shiftKey: false });
        Object.defineProperty(toolService, 'currentTool', { value: { type: ToolType.Pencil } });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(clipboard.delete).not.toHaveBeenCalled();
    });

    it('#dispatch with M should toggle snap to grid', () => {
        // Arrange
        const event = new KeyboardEvent('keydown', { key: Keyboard.M, repeat: false, ctrlKey: false, shiftKey: false });

        // Act
        service['registerShortcuts']();
        service.dispatch(event);

        // Assert
        expect(snapGrid.toggle).toHaveBeenCalled();
    });
});
