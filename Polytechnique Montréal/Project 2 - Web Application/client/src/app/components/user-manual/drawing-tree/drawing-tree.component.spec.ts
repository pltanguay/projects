import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { UserGuideItem } from '@app/classes/interfaces/user-guide';
import { DrawingTreeComponent } from './drawing-tree.component';

describe('DrawingTreeComponent', () => {
    let component: DrawingTreeComponent;
    let fixture: ComponentFixture<DrawingTreeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawingTreeComponent],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingTreeComponent);
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

        component.drawingNode.subscribe((node: UserGuideItem) => {
            updatedNode = node;
        });

        component.onNodeClick(currentNode);
        expect(updatedNode).toEqual(currentNode);
    });
});
