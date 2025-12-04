import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page'; // ⬅️ IMPORTAÇÃO CORRETA

const routes: Routes = [
  {
    path: '',
    component: HomePage, // ⬅️ USANDO O COMPONENTE
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}