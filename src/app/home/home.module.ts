import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // ⬅️ IMPORTADO!

import { HomePage } from './home.page'; // ⬅️ IMPORTAÇÃO CORRETA
import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // ⬅️ Adicionado ao imports
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage] // ⬅️ Declarado
})
export class HomePageModule {}