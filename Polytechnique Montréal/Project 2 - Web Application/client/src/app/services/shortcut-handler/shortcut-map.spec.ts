import { Keyboard } from '@app/declarations/keyboard.enum';
import { Shortcut } from './shortcut';
import { ShortcutMap } from './shortcut-map';

class ShortcutMapTest extends ShortcutMap {}
// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('BaseTrace', () => {
    let shortcutMap: ShortcutMapTest;

    beforeEach(() => {
        shortcutMap = new ShortcutMapTest();
    });

    it('should be created', () => {
        expect(shortcutMap).toBeTruthy();
    });

    it('should get the right callback for shortcut from map', () => {
        // Arrange
        const callback = () => {
            return 1;
        };
        const shortcut = new Shortcut(Keyboard.A);
        shortcutMap['map'].set(shortcut.toString(), callback);

        // Act
        const returnCallback = shortcutMap.get(shortcut);

        // Assert
        expect(returnCallback).toEqual(callback);
    });

    it('should set callback for shortcut to private map', () => {
        // Arrange
        const callback = () => {
            return 1;
        };
        const shortcut = new Shortcut(Keyboard.A);
        spyOn<any>(shortcutMap['map'], 'set');

        // Act
        shortcutMap.set(shortcut, callback);

        // Assert
        expect(shortcutMap['map'].set).toHaveBeenCalled();
    });
});
