import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorSpaceComponent } from './components/editor-space/editor-space.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: EntryPointComponent },
    { path: 'editor-space', component: EditorSpaceComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
