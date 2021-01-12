import { Type } from '@angular/core';
import { Tool } from '@app/classes/tool/tool';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
export interface ToolItem {
    tool: Tool;
    attributeComponent: Type<AbsAttributeDirective>;
}
