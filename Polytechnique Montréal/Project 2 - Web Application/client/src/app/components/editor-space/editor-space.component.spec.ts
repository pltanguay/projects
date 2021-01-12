import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { MaterialModule } from '@app/material.module';
import { EditorSpaceComponent } from './editor-space.component';

describe('EditorSpaceComponent', () => {
    let component: EditorSpaceComponent;
    let fixture: ComponentFixture<EditorSpaceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditorSpaceComponent],
            providers: [{ provide: HttpClient, useValue: {} }],
            imports: [MaterialModule, AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorSpaceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
