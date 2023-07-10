import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InputComsuptionPageRoutingModule } from './input-comsuption-routing.module';

import { InputComsuptionPage } from './input-comsuption.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InputComsuptionPageRoutingModule
  ],
  declarations: [InputComsuptionPage]
})
export class InputComsuptionPageModule {}
