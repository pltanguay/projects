import { Injectable, Type } from '@angular/core';
import { ToolItem } from '@app/classes/interfaces/tool-item';
import { Tool } from '@app/classes/tool/tool';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { BrushAttributesComponent } from '@app/components/editor-space/attribute-panel/brush-attributes/brush-attributes.component';
import { BucketAttributesComponent } from '@app/components/editor-space/attribute-panel/bucket-attributes/bucket-attributes.component';
import { ColorPickerAttributeComponent } from '@app/components/editor-space/attribute-panel/color-picker/color-picker-attribute/color-picker-attribute.component';
import { EllipseAttributeComponent } from '@app/components/editor-space/attribute-panel/ellipse-attribute/ellipse-attribute.component';
import { EraserAttributesComponent } from '@app/components/editor-space/attribute-panel/eraser-attributes/eraser-attributes.component';
import { FeatherPenAttributesComponent } from '@app/components/editor-space/attribute-panel/feather-pen-attributes/feather-pen-attributes.component';
import { GridAttributeComponent } from '@app/components/editor-space/attribute-panel/grid-attribute/grid-attribute.component';
import { LineAttributesComponent } from '@app/components/editor-space/attribute-panel/line-attributes/line-attributes.component';
import { PencilAttributesComponent } from '@app/components/editor-space/attribute-panel/pencil-attributes/pencil-attributes.component';
import { PolygoneAttributeComponent } from '@app/components/editor-space/attribute-panel/polygone-attribute/polygone-attribute.component';
import { RectangleAttributeComponent } from '@app/components/editor-space/attribute-panel/rectangle-attribute/rectangle-attribute.component';
import { EllipseSelectionAttributeComponent } from '@app/components/editor-space/attribute-panel/selection-attribute/ellipse-selection-attribute/ellipse-selection-attribute.component';
import { MagicWandSelectionAttributeComponent } from '@app/components/editor-space/attribute-panel/selection-attribute/magic-wand-selection-attribute/magic-wand-selection-attribute/magic-wand-selection-attribute.component';
import { RectangleSelectionAttributeComponent } from '@app/components/editor-space/attribute-panel/selection-attribute/rectangle-selection-attribute/rectangle-selection-attribute.component';
import { SprayAttributesComponent } from '@app/components/editor-space/attribute-panel/spray-attributes/spray-attributes.component';
import { StampAttributesComponent } from '@app/components/editor-space/attribute-panel/stamp-attributes/stamp-attributes.component';
import { TextAttributeComponent } from '@app/components/editor-space/attribute-panel/text-attribute/text-attribute.component';
import { ToolsMap, ToolType } from '@app/declarations/tool-declarations';
import { BrushService } from '@app/services/tools/base-trace/brush/brush-service';
import { FeatherPenService } from '@app/services/tools/base-trace/feather-pen/feather-pen.service';
import { PencilService } from '@app/services/tools/base-trace/pencil/pencil-service';
import { SprayService } from '@app/services/tools/base-trace/spray/spray.service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse-selection/ellipse-selection.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle-selection/rectangle-selection.service';
import { Observable, Subject } from 'rxjs';
import { EraserService } from './base-trace/eraser/eraser.service';
import { BucketService } from './bucket/bucket.service';
import { ColorPickerService } from './color-picker/color-picker.service';
import { EllipseService } from './contour-shape/ellipse/ellipse.service';
import { PolygoneService } from './contour-shape/polygone/polygone.service';
import { RectangleService } from './contour-shape/rectangle/rectangle.service';
import { GridService } from './grid-service/grid.service';
import { LineService } from './line/line.service';
import { MagicWandSelectionService } from './selection/magic-wand-selection/magic-wand-selection.service';
import { StampService } from './stamp/stamp.service';
import { TextService } from './text/text.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectNotifierService {
    private TOOLS_MAP: ToolsMap;
    private currentPanel: Type<AbsAttributeDirective>;
    currentTool: Tool;
    toolAttributePanel: Subject<Type<AbsAttributeDirective>>;
    constructor(
        private pencilService: PencilService,
        private lineService: LineService,
        private brushService: BrushService,
        private ellipseService: EllipseService,
        private polygoneService: PolygoneService,
        private eraserService: EraserService,
        private stampService: StampService,
        private sprayService: SprayService,
        private rectangleService: RectangleService,
        private rectangleSelectionService: RectangleSelectionService,
        private ellipseSelectionService: EllipseSelectionService,
        private magicWandSelectionService: MagicWandSelectionService,
        private bucketService: BucketService,
        private textService: TextService,
        private colorPickerService: ColorPickerService,
        private featherPenService: FeatherPenService,
        public gridService: GridService,
    ) {
        this.TOOLS_MAP = {
            Pencil: { tool: this.pencilService, attributeComponent: PencilAttributesComponent },
            Brush: { tool: this.brushService, attributeComponent: BrushAttributesComponent },
            Ellipse: { tool: this.ellipseService, attributeComponent: EllipseAttributeComponent },
            Polygone: { tool: this.polygoneService, attributeComponent: PolygoneAttributeComponent },
            Eraser: { tool: this.eraserService, attributeComponent: EraserAttributesComponent },
            Stamp: { tool: this.stampService, attributeComponent: StampAttributesComponent },
            Spray: { tool: this.sprayService, attributeComponent: SprayAttributesComponent },
            Line: { tool: this.lineService, attributeComponent: LineAttributesComponent },
            Rectangle: { tool: this.rectangleService, attributeComponent: RectangleAttributeComponent },
            RectangleSelection: { tool: this.rectangleSelectionService, attributeComponent: RectangleSelectionAttributeComponent },
            EllipseSelection: { tool: this.ellipseSelectionService, attributeComponent: EllipseSelectionAttributeComponent },
            MagicWandSelection: { tool: this.magicWandSelectionService, attributeComponent: MagicWandSelectionAttributeComponent },
            Bucket: { tool: this.bucketService, attributeComponent: BucketAttributesComponent },
            Text: { tool: this.textService, attributeComponent: TextAttributeComponent },
            ColorPicker: { tool: this.colorPickerService, attributeComponent: ColorPickerAttributeComponent },
            FeatherPen: { tool: this.featherPenService, attributeComponent: FeatherPenAttributesComponent },
            Grid: { tool: this.gridService, attributeComponent: GridAttributeComponent },
        };
        this.currentTool = this.TOOLS_MAP.Pencil.tool;
        this.currentPanel = this.TOOLS_MAP.Pencil.attributeComponent;
        this.toolAttributePanel = new Subject<Type<AbsAttributeDirective>>();
    }

    getToolPanel(): Observable<Type<AbsAttributeDirective>> {
        return this.toolAttributePanel.asObservable();
    }

    selectTool(toolType: ToolType): void {
        const nextToolItem: ToolItem = this.TOOLS_MAP[toolType];
        if (this.currentTool.type !== ToolType.Grid) this.currentTool.stopDrawing();

        nextToolItem.tool.startDrawing();
        this.currentTool = nextToolItem.tool;
        this.currentPanel = nextToolItem.attributeComponent;
        this.toolAttributePanel.next(nextToolItem.attributeComponent);
    }

    isWritingInTextTool(): boolean {
        if (this.currentTool.type === ToolType.Text) {
            return this.currentTool.isProcessing;
        }
        return false;
    }

    getInitialToolPanel(): Type<AbsAttributeDirective> {
        return this.currentPanel;
    }

    isToolPreviewCleanable(): boolean {
        return this.currentTool.type !== ToolType.Line && this.currentTool.type !== ToolType.Text;
    }
}
