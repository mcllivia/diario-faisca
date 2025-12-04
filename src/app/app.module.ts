// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Adicione as importações necessárias:
import { FormsModule } from '@angular/forms'; // 1. Para usar [(ngModel)] no HTML
import { IonicStorageModule } from '@ionic/storage-angular'; // 2. Para o Serviço de Diário

@NgModule({
  // Seus componentes, pipes e diretivas
  declarations: [AppComponent], 
  
  // Módulos que este módulo importa
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    
    // Insira ou verifique estes dois módulos abaixo:
    FormsModule, // Adiciona suporte a formulários baseados em template (ngModel)
    IonicStorageModule.forRoot() // Configura o Ionic Storage para o projeto
  ],
  
  // Serviços que devem ser injetados
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  
  // O componente raiz (inicial)
  bootstrap: [AppComponent],
})
export class AppModule {}