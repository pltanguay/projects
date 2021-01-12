import { Injectable } from '@angular/core';
import { Pencil } from '@app/classes/base-trace/pencil/pencil';
import { DEFAULT_TOOL_WIDTH } from '@app/classes/tool/tool';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BaseTraceService } from '@app/services/tools/base-trace/base-trace.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends BaseTraceService {
    width: number;
    color: string;

    readonly type: ToolType;

    constructor(drawingService: DrawingService, snapshotFactory: SnapshotFactoryService) {
        super(drawingService, snapshotFactory);
        this.type = ToolType.Pencil;
        this.width = DEFAULT_TOOL_WIDTH;
        this.newTrace();
    }

    protected newTrace(): void {
        this.currentTrace = new Pencil(this.width, this.color);
    }
}
