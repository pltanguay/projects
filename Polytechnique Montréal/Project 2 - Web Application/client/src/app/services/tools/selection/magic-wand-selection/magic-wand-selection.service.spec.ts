import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Matrix } from '@app/classes/matrix/matrix';
import { MagicWandSelection } from '@app/classes/selection-shape/selection/magic-wand-selection/magic-wand-selection';
import { MouseButton } from '@app/declarations/mouse.enum';
import { SelectionCopy } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { MagicWandAlgorithmService } from './magic-wand-algorithm.service';
import { MagicWandSelectionService } from './magic-wand-selection.service';
// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any

describe('MagicWandSelectionService', () => {
    let service: MagicWandSelectionService;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let mathService: jasmine.SpyObj<MathUtilsService>;
    let algorithmService: jasmine.SpyObj<MagicWandAlgorithmService>;
    let rendererSpy: jasmine.SpyObj<Renderer2>;
    let canvasStub: HTMLCanvasElement;
    let event: jasmine.SpyObj<PointerEvent>;

    beforeEach(() => {
        rendererSpy = jasmine.createSpyObj('Renderer2', ['createElement']);

        rendererSpy.createElement.and.returnValue(document.createElement('canvas'));
        snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);
        mathService = jasmine.createSpyObj('MathUtilsService', ['']);

        algorithmService = jasmine.createSpyObj('', ['onMouseLeft', 'onMouseRight']);

        const result = {
            borderPoints: new Set<Vec2>([{ x: 0, y: 0 }]),
            selectionCanvasArray: new Uint32Array(100),
            clippedSelectionArray: new Uint32Array(100),
            boxBorders: { left: 0, top: 0, right: 8, bottom: 8 },
            borderPath: new Path2D(),
        };
        algorithmService.onMouseRight.and.returnValue(result);
        algorithmService.onMouseLeft.and.returnValue(result);

        canvasStub = document.createElement('canvas');
        const canvasElement = new ElementRef<HTMLCanvasElement>(canvasStub);
        canvasElement.nativeElement.width = 10;
        canvasElement.nativeElement.height = 10;
        const ctx = canvasElement.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
            canvasWidth: 10,
            canvasHeight: 10,
            baseCtx: ctx,
        };

        event = {
            ...jasmine.createSpyObj<PointerEvent>('PointerEvent', ['stopPropagation']),
            button: MouseButton.Left,
            offsetX: 3,
            offsetY: 3,
        };

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MathUtilsService, useValue: mathService },
                { provide: SnapshotFactoryService, useValue: snapshotFactory },
                { provide: MagicWandAlgorithmService, useValue: algorithmService },
            ],
            imports: [MatSnackBarModule],
        });

        service = TestBed.inject(MagicWandSelectionService);
        service['renderer'] = rendererSpy;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should not call #stopPropagation when the selection is active', () => {
        // Arrange
        service['selectionActive'] = true;

        // Act
        service.onMouseDown(event);

        // Assert
        expect(event.stopPropagation).not.toHaveBeenCalled();
    });

    it('#onMouseDown with left button should call #onMouseLeft of selectionAlgorithmservice', () => {
        // Arrange

        // Act
        service.onMouseDown(event);

        // Assert
        expect(algorithmService.onMouseLeft).toHaveBeenCalled();
    });

    it('#onMouseDown with right button should call #onMouseRight of selectionAlgorithmservice', () => {
        // Arrange
        event = { ...event, button: MouseButton.Right };

        // Act
        service.onMouseDown(event);

        // Assert
        expect(algorithmService.onMouseRight).toHaveBeenCalled();
    });

    it('#newPaste should change #currentSelection', () => {
        // Arrange
        const copy: SelectionCopy = {
            selection: new MagicWandSelection(canvasStub, canvasStub, new ImageData(10, 10), new Matrix()),
            borderPoints: new Set([{ x: 0, y: 0 }]),
            matrix: new Matrix(),
            type: {} as any,
        };

        // Act
        service['newPaste'](copy);

        // Assert
        expect(service['currentSelection']).not.toBeNull();
    });
});
