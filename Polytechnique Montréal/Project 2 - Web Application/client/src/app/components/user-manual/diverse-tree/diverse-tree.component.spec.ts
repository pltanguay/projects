import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { UserGuideItem } from '@app/classes/interfaces/user-guide';
import { DiverseTreeComponent } from './diverse-tree.component';
describe('DiverseTreeComponent', () => {
    let component: DiverseTreeComponent;
    let fixture: ComponentFixture<DiverseTreeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DiverseTreeComponent],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiverseTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onNodeClick should emit the updated guide values', () => {
        let updatedNode: UserGuideItem = {
            title: '',
        };
        const currentNode: UserGuideItem = {
            title: 'Current node',
        };

        component.diverseNode.subscribe((node: UserGuideItem) => {
            updatedNode = node;
        });

        component.onNodeClick(currentNode);
        expect(updatedNode).toEqual(currentNode);
    });
});
