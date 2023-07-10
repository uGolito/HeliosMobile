import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsumptionCounterPage } from './consumption-counter.page';

const routes: Routes = [
  {
    path: '',
    component: ConsumptionCounterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumptionCounterPageRoutingModule {}
