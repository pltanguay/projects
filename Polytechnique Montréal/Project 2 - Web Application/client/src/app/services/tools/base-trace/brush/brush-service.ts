import { Injectable } from '@angular/core';
import { Brush, FILTER_NONE } from '@app/classes/base-trace/brush/brush';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BaseTraceService } from '@app/services/tools/base-trace/base-trace.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

export const enum TextureType {
    Shadow = 'Ombre',
    Blur = 'Flou',
    BlackShadow = 'Ombre Noire',
    Linear = 'Linéaire',
    Dots = 'Points',
    Fractal = 'Fractal',
}

@Injectable({
    providedIn: 'root',
})
export class BrushService extends BaseTraceService {
    texture: TextureType;
    private filter: string;
    private textureBindings: Map<string, string>;

    readonly type: ToolType;

    constructor(drawingService: DrawingService, snapShotService: SnapshotFactoryService) {
        super(drawingService, snapShotService);
        this.texture = TextureType.Shadow;
        this.filter = FILTER_NONE;
        this.type = ToolType.Brush;
        this.textureBindings = new Map();
        this.newTrace();

        this.textureBindings
            .set(TextureType.Shadow, 'none')
            .set(TextureType.Blur, 'blur(4px)')
            .set(TextureType.BlackShadow, 'url(#blackShadow)')
            .set(TextureType.Linear, 'url(#linear)')
            .set(TextureType.Dots, 'url(#dots)')
            .set(TextureType.Fractal, 'url(#fractal)');
    }

    private updateFilter(): void {
        this.filter = this.textureBindings.get(this.texture) as string;
    }

    protected newTrace(): void {
        this.updateFilter();
        this.currentTrace = new Brush(this.width, this.color, this.filter);
    }
}
