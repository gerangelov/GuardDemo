import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutosaveGuard } from './autosave/autosave.guard';
import { BarComponent } from './bar/bar.component';
import { FooComponent } from './foo/foo.component';

const routes: Routes = [
  {
    path: '',
    component: BarComponent,
    canDeactivate: [AutosaveGuard]
  },
  {
    path: 'foo',
    component: FooComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
