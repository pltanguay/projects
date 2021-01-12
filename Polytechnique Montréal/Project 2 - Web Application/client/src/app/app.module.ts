import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertComponent } from '@app/components/editor-space/alert/alert.component';
import { GridAttributeComponent } from '@app/components/editor-space/attribute-panel/grid-attribute/grid-attribute.component';
import { RectangleAttributeComponent } from '@app/components/editor-space/attribute-panel/rectangle-attribute/rectangle-attribute.component';
import { MagicWandSelectionAttributeComponent } from '@app/components/editor-space/attribute-panel/selection-attribute/magic-wand-selection-attribute/magic-wand-selection-attribute/magic-wand-selection-attribute.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { AbsAttributeDirective } from './components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { AttributePanelComponent } from './components/editor-space/attribute-panel/attribute-panel.component';
import { BrushAttributesComponent } from './components/editor-space/attribute-panel/brush-attributes/brush-attributes.component';
import { BucketAttributesComponent } from './components/editor-space/attribute-panel/bucket-attributes/bucket-attributes.component';
import { ColorPickerAttributeComponent } from './components/editor-space/attribute-panel/color-picker/color-picker-attribute/color-picker-attribute.component';
import { EllipseAttributeComponent } from './components/editor-space/attribute-panel/ellipse-attribute/ellipse-attribute.component';
import { EraserAttributesComponent } from './components/editor-space/attribute-panel/eraser-attributes/eraser-attributes.component';
import { FeatherPenAttributesComponent } from './components/editor-space/attribute-panel/feather-pen-attributes/feather-pen-attributes.component';
import { LineAttributesComponent } from './components/editor-space/attribute-panel/line-attributes/line-attributes.component';
import { PencilAttributesComponent } from './components/editor-space/attribute-panel/pencil-attributes/pencil-attributes.component';
import { PolygoneAttributeComponent } from './components/editor-space/attribute-panel/polygone-attribute/polygone-attribute.component';
import { ClipboardComponent } from './components/editor-space/attribute-panel/selection-attribute/clipboard/clipboard.component';
import { EllipseSelectionAttributeComponent } from './components/editor-space/attribute-panel/selection-attribute/ellipse-selection-attribute/ellipse-selection-attribute.component';
import { RectangleSelectionAttributeComponent } from './components/editor-space/attribute-panel/selection-attribute/rectangle-selection-attribute/rectangle-selection-attribute.component';
import { SprayAttributesComponent } from './components/editor-space/attribute-panel/spray-attributes/spray-attributes.component';
import { StampAttributesComponent } from './components/editor-space/attribute-panel/stamp-attributes/stamp-attributes.component';
import { TextAttributeComponent } from './components/editor-space/attribute-panel/text-attribute/text-attribute.component';
import { ColorPaletteComponent } from './components/editor-space/color-palette/color-palette.component';
import { HueSliderComponent } from './components/editor-space/color-palette/hue-slider/hue-slider.component';
import { PaletteComponent } from './components/editor-space/color-palette/palette/palette.component';
import { BaseCanvasComponent } from './components/editor-space/drawing-space/base-canvas/base-canvas.component';
import { DrawingSpaceComponent } from './components/editor-space/drawing-space/drawing-space.component';
import { GridCanvasComponent } from './components/editor-space/drawing-space/grid-canvas/grid-canvas.component';
import { PreviewCanvasComponent } from './components/editor-space/drawing-space/preview-canvas/preview-canvas.component';
import { ResizeContainerComponent } from './components/editor-space/drawing-space/resize-container/resize-container.component';
import { ResizeIndicatorComponent } from './components/editor-space/drawing-space/resize-indicator/resize-indicator.component';
import { EditorSpaceComponent } from './components/editor-space/editor-space.component';
import { CarouselIconComponent } from './components/editor-space/sidebar/actions/carousel-icon/carousel-icon.component';
import { ExportDrawingComponent } from './components/editor-space/sidebar/actions/export-drawing/export-drawing.component';
import { HomeIconComponent } from './components/editor-space/sidebar/actions/home-icon/home-icon.component';
import { ImportDrawingComponent } from './components/editor-space/sidebar/actions/import-drawing/import-drawing.component';
import { NewDrawingComponent } from './components/editor-space/sidebar/actions/new-drawing/new-drawing.component';
import { SaveDrawingComponent } from './components/editor-space/sidebar/actions/save-drawing/save-drawing.component';
import { UndoRedoComponent } from './components/editor-space/sidebar/actions/undo-redo/undo-redo/undo-redo.component';
import { UserManualIconComponent } from './components/editor-space/sidebar/actions/user-manual-icon/user-manual-icon.component';
import { SidebarComponent } from './components/editor-space/sidebar/sidebar.component';
import { ToolIconGroupComponent } from './components/editor-space/sidebar/tool-icon-group/tool-icon-group.component';
import { ToolIconComponent } from './components/editor-space/sidebar/tool-icon/tool-icon.component';
import { WorkspaceComponent } from './components/editor-space/workspace/workspace.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { ControlPointComponent } from './components/selection/control-point/control-point.component';
import { SelectionBoxComponent } from './components/selection/selection-box/selection-box.component';
import { SelectionIndicatorComponent } from './components/selection/selection-indicator/selection-indicator.component';
import { SelectionComponent } from './components/selection/selection.component';
import { SnapToGridComponent } from './components/snap-to-grid/snap-to-grid.component';
import { DiverseTreeComponent } from './components/user-manual/diverse-tree/diverse-tree.component';
import { DrawingTreeComponent } from './components/user-manual/drawing-tree/drawing-tree.component';
import { UserManualComponent } from './components/user-manual/user-manual.component';
import { CanvasDirective } from './directives/canvas/canvas.directive';
import { SgvFiltersDirective } from './directives/svg-filter/sgv-filters.directive';
import { MaterialModule } from './material.module';

@NgModule({
    declarations: [
        AppComponent,
        EntryPointComponent,
        EditorSpaceComponent,
        WorkspaceComponent,
        DrawingSpaceComponent,
        AttributePanelComponent,
        SidebarComponent,
        UserManualComponent,
        ResizeIndicatorComponent,
        ToolIconComponent,
        ToolIconGroupComponent,
        ColorPaletteComponent,
        HueSliderComponent,
        PaletteComponent,
        LineAttributesComponent,
        PencilAttributesComponent,
        GridAttributeComponent,
        BrushAttributesComponent,
        EllipseAttributeComponent,
        TextAttributeComponent,
        EraserAttributesComponent,
        RectangleAttributeComponent,
        PolygoneAttributeComponent,
        CanvasDirective,
        BaseCanvasComponent,
        PreviewCanvasComponent,
        GridCanvasComponent,
        SgvFiltersDirective,
        NewDrawingComponent,
        SaveDrawingComponent,
        ImportDrawingComponent,
        ExportDrawingComponent,
        UserManualIconComponent,
        DrawingTreeComponent,
        DiverseTreeComponent,
        AbsAttributeDirective,
        ResizeContainerComponent,
        BucketAttributesComponent,
        ColorPickerAttributeComponent,
        RectangleSelectionAttributeComponent,
        EllipseSelectionAttributeComponent,
        ControlPointComponent,
        CarouselComponent,
        SelectionBoxComponent,
        SelectionComponent,
        UndoRedoComponent,
        CarouselComponent,
        UndoRedoComponent,
        CarouselComponent,
        AlertComponent,
        CarouselIconComponent,
        StampAttributesComponent,
        FeatherPenAttributesComponent,
        SprayAttributesComponent,
        SelectionIndicatorComponent,
        HomeIconComponent,
        MagicWandSelectionAttributeComponent,
        ClipboardComponent,
        SnapToGridComponent,
    ],
    imports: [MatMenuModule, BrowserModule, HttpClientModule, AppRoutingModule, BrowserAnimationsModule, MaterialModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
