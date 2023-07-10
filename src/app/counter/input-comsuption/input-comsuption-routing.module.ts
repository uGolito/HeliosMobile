import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InputComsuptionPage } from './input-comsuption.page';

const routes: Routes = [
  {
    path: '',
    component: InputComsuptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputComsuptionPageRoutingModule {}
