import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'thermostat',
    loadChildren: () => import('./thermostat/thermostat.module').then( m => m.ThermostatPageModule)
  },
  {
    path: 'pincode',
    loadChildren: () => import('./qrcode/pincode/pincode.module').then( m => m.PincodePageModule)
  },
  {
    path: 'consumption-counter',
    loadChildren: () => import('./counter/consumption-counter/consumption-counter.module').then( m => m.ConsumptionCounterPageModule)
  },
  {
    path: 'input-comsuption',
    loadChildren: () => import('./counter/input-comsuption/input-comsuption.module').then( m => m.InputComsuptionPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
