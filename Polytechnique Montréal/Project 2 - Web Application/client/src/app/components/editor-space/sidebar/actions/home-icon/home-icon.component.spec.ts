import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { HomeIconComponent } from './home-icon.component';

describe('HomeIconComponent', () => {
    let component: HomeIconComponent;
    let fixture: ComponentFixture<HomeIconComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeIconComponent],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
