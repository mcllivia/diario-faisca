// src/app/home/home.page.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DiarioService, RegistroFaísca } from '../services/diario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit { // ⬅️ A PALAVRA-CHAVE 'export' ESTÁ AQUI
// ... (O restante do código da classe HomePage, que está completo)
  registros$!: Observable<RegistroFaísca[]>;
  isSaving = false; 
  registroParaEditar: RegistroFaísca | null = null; 

  novoRegistro: Omit<RegistroFaísca, 'id' | 'dataRegistro'> = {
    tipo: 'Recurso',
    titulo: '',
    descricao: ''
  };

  constructor(private diarioService: DiarioService) {}

  ngOnInit() {
    this.registros$ = this.diarioService.registros$;
  }

  // --- Funções de Criação (Create) ---
  adicionarNovoRegistro() {
    if (this.novoRegistro.titulo && this.novoRegistro.descricao && !this.isSaving) {
      
      this.isSaving = true;
      
      this.diarioService.adicionarRegistro(this.novoRegistro).subscribe({
        next: () => {
          this.novoRegistro = { tipo: 'Recurso', titulo: '', descricao: '' };
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Erro ao salvar registro:', err);
          this.isSaving = false;
        }
      });
    }
  }

  // --- Funções de Edição (Update) ---
  iniciarEdicao(registro: RegistroFaísca) {
    this.registroParaEditar = { ...registro };
  }

  cancelarEdicao() {
    this.registroParaEditar = null;
  }

  salvarEdicao() {
    if (this.registroParaEditar && this.registroParaEditar.titulo) {
      this.isSaving = true;

      this.diarioService.atualizarRegistro(this.registroParaEditar).subscribe({
        next: () => {
          this.cancelarEdicao(); 
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Erro ao editar registro:', err);
          this.isSaving = false;
        }
      });
    }
  }

  // --- Funções de Exclusão (Delete) ---
  excluirRegistro(id: number) {
    this.diarioService.excluirRegistro(id).subscribe();
  }
  
  // Função auxiliar para obter o ícone
  getIconeTipo(tipo: 'Recurso' | 'Local' | 'Perigo'): string {
    switch (tipo) {
      case 'Recurso': return 'color-fill-outline';
      case 'Local': return 'map-outline';
      case 'Perigo': return 'warning-outline';
      default: return 'help-circle-outline';
    }
  }
}