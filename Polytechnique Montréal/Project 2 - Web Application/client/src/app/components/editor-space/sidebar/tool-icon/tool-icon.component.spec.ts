import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { ToolType } from '@app/declarations/tool-declarations';
import { ToolIconComponent } from './tool-icon.component';

describe('ToolIconComponent', () => {
    let component: ToolIconComponent;
    let fixture: ComponentFixture<ToolIconComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolIconComponent],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit an output event when an icon is clicked', () => {
        // Arrange
        component.type = ToolType.Brush;
        const clickIconEmitSpy = spyOn(component.clickIcon, 'emit');

        // Act
        component.onClickIcon();

        // Assert
        expect(clickIconEmitSpy).toHaveBeenCalled();
    });

    it('#onClickIcon should emit the clicked tool type', () => {
        // Arrange
        component.type = ToolType.Brush;
        const clickIconEmitSpy = spyOn(component.clickIcon, 'emit');

        // Act
        component.onClickIcon();

        // Assert
        expect(clickIconEmitSpy).toHaveBeenCalledWith(component.type);
    });
});
