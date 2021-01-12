import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { PencilAttributesComponent } from '@app/components/editor-space/attribute-panel/pencil-attributes/pencil-attributes.component';
import { ToolType } from '@app/declarations/tool-declarations';
import { Subject } from 'rxjs';
import { ToolSelectNotifierService } from './tool-select-notifier.service';

// tslint:disable:no-string-literal
describe('ToolSelectNotifierService', () => {
    let service: ToolSelectNotifierService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(ToolSelectNotifierService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getToolPanel should return an observable', () => {
        // Arrange
        const subject = new Subject<Type<AbsAttributeDirective>>();
        const expectedObs = subject.asObservable();

        // Act
        const gotObs = service.getToolPanel();

        // Assert
        expect(gotObs).toEqual(expectedObs);
    });

    it('#selectTool should call the current tool"s stopDrawing method', () => {
        // Arrange
        const stopDrawingSpy = spyOn(service.currentTool, 'stopDrawing');
        const toolType = ToolType.Pencil;

        // Act
        service.selectTool(toolType);

        // Assert
        expect(stopDrawingSpy).toHaveBeenCalled();
    });

    it('#selectTool should not call stopDrawing method if current tool is grid', () => {
        // Arrange
        const stopDrawingSpy = spyOn(service.currentTool, 'stopDrawing');
        Object.defineProperty(service.currentTool, 'type', { value: ToolType.Grid });
        const toolType = ToolType.Grid;

        // Act
        service.selectTool(toolType);

        // Assert
        expect(stopDrawingSpy).not.toHaveBeenCalled();
    });

    it('#selectTool should call the selected tool"s startDrawing method', () => {
        // Arrange
        spyOn(service.currentTool, 'stopDrawing');
        const toolType = ToolType.Line;
        const startDrawingSpy = spyOn(service['TOOLS_MAP'][toolType].tool, 'startDrawing');

        // Act
        service.selectTool(toolType);

        // Assert
        expect(startDrawingSpy).toHaveBeenCalled();
    });

    it('#selectTool should update #currentTool to selected tool', () => {
        // Arrange
        const toolType = ToolType.Pencil;
        const expectedTool = service['TOOLS_MAP'][toolType].tool;
        spyOn(service['TOOLS_MAP'][toolType].tool, 'stopDrawing');

        // Act
        service.selectTool(ToolType.Pencil);

        // Assert
        expect(service.currentTool).toBeTruthy(expectedTool);
    });

    it('#getInitialToolPanel should return the selected tools panel', () => {
        // Arrange
        service['currentPanel'] = PencilAttributesComponent;

        // Act
        const currentPanel = service.getInitialToolPanel();

        // Assert
        expect(currentPanel).toBe(PencilAttributesComponent);
    });

    it('#isWritingInTextTool should return #isProcessing value if #currentTool is Text tool', () => {
        // Arrange
        service.currentTool = service['TOOLS_MAP'].Text.tool;
        // Act
        const result = service.isWritingInTextTool();

        // Assert
        expect(result).toBe(service.currentTool.isProcessing);
    });

    it('#isWritingInTextTool should return false if #currentTool is not Text tool', () => {
        // Arrange
        service.currentTool = service['TOOLS_MAP'].Brush.tool;

        // Act
        const result = service.isWritingInTextTool();

        // Assert
        expect(result).toBe(false);
    });

    it('#isToolPreviewCleanable should return false if #currentTool is Text tool', () => {
        // Arrange
        service.currentTool = service['TOOLS_MAP'].Text.tool;

        // Act
        const result = service.isToolPreviewCleanable();

        // Assert
        expect(result).toBe(false);
    });

    it('#isToolPreviewCleanable should return false if #currentTool is Line tool', () => {
        // Arrange
        service.currentTool = service['TOOLS_MAP'].Line.tool;

        // Act
        const result = service.isToolPreviewCleanable();

        // Assert
        expect(result).toBe(false);
    });

    it('#isToolPreviewCleanable should return false if #currentTool is not Text or Line tool', () => {
        // Arrange
        service.currentTool = service['TOOLS_MAP'].Brush.tool;

        // Act
        const result = service.isToolPreviewCleanable();

        // Assert
        expect(result).toBe(true);
    });
});
