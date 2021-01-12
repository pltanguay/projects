import { SidebarToolData } from '@app/classes/interfaces/sidebar-tool-data';
import { ToolItem } from '@app/classes/interfaces/tool-item';
import { Keyboard } from './keyboard.enum';

export const enum ToolType {
    FeatherPen = 'FeatherPen',
    Pencil = 'Pencil',
    Brush = 'Brush',
    Eraser = 'Eraser',
    Stamp = 'Stamp',
    Spray = 'Spray',
    Rectangle = 'Rectangle',
    Ellipse = 'Ellipse',
    Line = 'Line',
    RectangleSelection = 'RectangleSelection',
    EllipseSelection = 'EllipseSelection',
    MagicWandSelection = 'MagicWandSelection',
    Bucket = 'Bucket',
    ColorPicker = 'ColorPicker',
    Polygone = 'Polygone',
    Text = 'Text',
    Grid = 'Grid',
}

export type ToolsMap = { readonly [key in ToolType]: ToolItem };

// To be used in sidebar
export const TOOLS_KEYBOARD: Map<string, ToolType> = new Map<string, ToolType>([
    [Keyboard.C, ToolType.Pencil],
    [Keyboard.P, ToolType.FeatherPen],
    [Keyboard.W, ToolType.Brush],
    [Keyboard.L, ToolType.Line],
    [Keyboard.E, ToolType.Eraser],
    [Keyboard.D, ToolType.Stamp],
    [Keyboard.A, ToolType.Spray],
    [Keyboard.Digit_1, ToolType.Rectangle],
    [Keyboard.Digit_2, ToolType.Ellipse],
    [Keyboard.Digit_3, ToolType.Polygone],
    [Keyboard.R, ToolType.RectangleSelection],
    [Keyboard.S, ToolType.EllipseSelection],
    [Keyboard.B, ToolType.Bucket],
    [Keyboard.I, ToolType.ColorPicker],
    [Keyboard.T, ToolType.Text],
    [Keyboard.G, ToolType.Grid],
]);

export const TOOL_ICON_DRAW: SidebarToolData[] = [
    { icon: 'fas fa-pencil-alt', type: ToolType.Pencil, tooltipText: 'Crayon - C' },
    { icon: 'fas fa-pen-fancy', type: ToolType.FeatherPen, tooltipText: 'Plume - P' },
    { icon: 'fas fa-paint-brush', type: ToolType.Brush, tooltipText: 'Pinceau - W' },
    { icon: 'fas fa-eraser', type: ToolType.Eraser, tooltipText: 'Efface - E' },
    { icon: 'fas fa-spray-can', type: ToolType.Spray, tooltipText: 'Aérosol - A' },
];
export const TOOL_ICON_SHAPE: SidebarToolData[] = [
    { icon: 'far fa-square', type: ToolType.Rectangle, tooltipText: 'Rectangle - 1' },
    { icon: 'far fa-circle', type: ToolType.Ellipse, tooltipText: 'Ellipse - 2' },
    { icon: 'fas fa-draw-polygon', type: ToolType.Polygone, tooltipText: 'Polygone - 3' },
    { icon: 'fas fa-slash', type: ToolType.Line, tooltipText: 'Ligne - L' },
];

export const TOOL_ICON_SELECTION: SidebarToolData[] = [
    { icon: 'fas fa-vector-square', type: ToolType.RectangleSelection, tooltipText: 'Selection par Rectangle - R' },
    { icon: 'fas fa-spinner', type: ToolType.EllipseSelection, tooltipText: 'Selection par Ellipse - S' },
    { icon: 'fas fa-magic', type: ToolType.MagicWandSelection, tooltipText: 'Selection par Baguette magique - V' },
    { icon: 'fas fa-border-none', type: ToolType.Grid, tooltipText: 'Grille - G' },
];

export const TOOL_ICON_UTILS: SidebarToolData[] = [
    { icon: 'fas fa-fill-drip', type: ToolType.Bucket, tooltipText: 'Sceau de peinture - B' },
    { icon: 'fas fa-eye-dropper', type: ToolType.ColorPicker, tooltipText: 'Pipette - I' },
    { icon: 'fa fa-font', type: ToolType.Text, tooltipText: 'Text - T' },
    { icon: 'fas fa-stamp', type: ToolType.Stamp, tooltipText: 'Étampe - D' },
];
