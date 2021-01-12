import { UserGuideItem } from '@app/classes/interfaces/user-guide';
import { TreeComponent } from './tree-component';
// tslint:disable:no-string-literal
describe('DiverseTreeComponent', () => {
    let component: TreeComponent;
    let guide: UserGuideItem;

    const INDEX = 0;

    beforeEach(() => {
        component = new TreeComponent();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#hasChild should return true if there is at least a leaf node', () => {
        guide = {
            title: 'Parent',
            subtitle: [{ title: 'Existing child' }],
        };
        expect(component.hasChild(INDEX, guide)).toBe(true);
    });

    it('#hasChild should return false if there is no leaf node', () => {
        guide = {
            title: 'Parent',
            subtitle: [],
        };
        expect(component.hasChild(INDEX, guide)).toBe(false);
    });

    it('#getNodeSubtitle should return correct subtitle', () => {
        // Arrange
        const nestedSubtitle: UserGuideItem[] = [
            {
                title: '',
            },
        ];
        guide = {
            title: 'Parent',
            subtitle: nestedSubtitle,
        };

        // Act
        const result = component['getNodeSubtitle'](guide);

        // Assert
        expect(result).toBe(nestedSubtitle);
    });
});
