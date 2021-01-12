import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { UserGuideItem } from '@app/classes/interfaces/user-guide';
import { UserManualComponent } from './user-manual.component';

describe('UserManualComponent', () => {
    let component: UserManualComponent;
    let fixture: ComponentFixture<UserManualComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserManualComponent],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserManualComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#setDrawingNode should update #updateGuide', () => {
        const guide: UserGuideItem = {
            title: 'Drawing Node',
        };

        spyOn(component, 'updateGuide');
        component.setDrawingNode(guide);
        expect(component.updateGuide).toHaveBeenCalledTimes(1);
    });

    it('#setDiverseNode should call #updateGuide', () => {
        const guide: UserGuideItem = {
            title: 'Diverse Node',
        };

        spyOn(component, 'updateGuide');
        component.setDiverseNode(guide);
        expect(component.updateGuide).toHaveBeenCalledTimes(1);
    });

    it('#onScroll should define the value of #finalOpacity to be maximum 1', () => {
        component.onScroll();
        expect(component.finalOpacity).toBeLessThanOrEqual(1);
    });

    it('#updateGuide should update variables', () => {
        const guide: UserGuideItem = {
            title: 'Some Node',
        };

        component.updateGuide(guide);
        expect(component.isEmptyInitially).toBe(false);
        expect(component.userGuide).toBe(guide);
        expect(component.finalOpacity).toBe(1);
    });

    it('#initialiseGuide should give an initial value to #userGuide if index provided is 0 or does not exist', () => {
        const guide: UserGuideItem = {
            title: 'Bienvenue',
            number: '0',
            sections: [
                {
                    description: 'Veuillez choisir un sujet concernant <span class="current-section-name">Divers</span>',
                },
            ],
        };

        component.initialiseGuide();
        expect(component.userGuide).toEqual(guide);
    });

    it('#initialiseGuide should give an initial value to #userGuide if index is not 0', () => {
        const guide: UserGuideItem = {
            title: 'Bienvenue',
            number: '0',
            sections: [
                {
                    description: 'Veuillez choisir un sujet concernant <span class="current-section-name">Dessiner</span>',
                },
            ],
        };

        component.initialiseGuide(1);
        expect(component.userGuide).toEqual(guide);
    });
});
