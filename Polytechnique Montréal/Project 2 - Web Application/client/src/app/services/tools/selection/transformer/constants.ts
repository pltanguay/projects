import { Point } from '@app/classes/utils/point';
import { Keyboard } from '@app/declarations/keyboard.enum';
export const MOVE_WAIT_DELAY = 500;
export const CONTINUOUS_MOVE_DELAY = 100;
export const PIXEL_DISTANCE = 3;

export const ARROW_KEYS = new Map<string, Point>([
    [Keyboard.UP_ARROW, { x: 0, y: -PIXEL_DISTANCE }],
    [Keyboard.DOWN_ARROW, { x: 0, y: PIXEL_DISTANCE }],
    [Keyboard.LEFT_ARROW, { x: -PIXEL_DISTANCE, y: 0 }],
    [Keyboard.RIGHT_ARROW, { x: PIXEL_DISTANCE, y: 0 }],
]);
