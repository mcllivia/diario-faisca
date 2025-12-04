// src/app/services/diario.service.ts
//oiii
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, switchMap, tap, take, map } from 'rxjs/operators';

export interface RegistroFaísca {
  id: number;
  tipo: 'Recurso' | 'Local' | 'Perigo';
  titulo: string;
  descricao: string;
  dataRegistro: number;
}

const STORAGE_KEY = 'diarioFaísca';

@Injectable({
  providedIn: 'root'
})
export class DiarioService {
  private _storage: Storage | null = null;
  private _registros = new BehaviorSubject<RegistroFaísca[]>([]);
  
  public registros$: Observable<RegistroFaísca[]> = this._registros.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    this.carregarRegistros();
  }

  carregarRegistros() {
    if (!this._storage) return;
    
    from(this._storage.get(STORAGE_KEY))
      .pipe(
        catchError(() => of([] as RegistroFaísca[]))
      )
      .subscribe((registros: RegistroFaísca[]) => {
        const registrosOrdenados = registros ? registros.sort((a, b) => b.dataRegistro - a.dataRegistro) : [];
        this._registros.next(registrosOrdenados);
      });
  }

  adicionarRegistro(registro: Omit<RegistroFaísca, 'id' | 'dataRegistro'>): Observable<RegistroFaísca[]> {
    if (!this._storage) {
        return of([]).pipe(tap(() => console.error('Storage não inicializado!')));
    }
      
    const novoRegistro: RegistroFaísca = {
      ...registro,
      id: Date.now(),
      dataRegistro: Date.now()
    };

    return this.registros$
      .pipe(
        take(1),
        switchMap(registrosAtuais => {
          const novaLista = [novoRegistro, ...registrosAtuais];
            
          return from(this._storage!.set(STORAGE_KEY, novaLista)).pipe(
            tap(() => this._registros.next(novaLista)), 
            map(() => novaLista) 
          );
        })
      );
  }

  atualizarRegistro(registroAtualizado: RegistroFaísca): Observable<RegistroFaísca[]> {
      if (!this._storage) {
          return of([]).pipe(tap(() => console.error('Storage não inicializado!')));
      }
        
      return this.registros$
          .pipe(
              take(1),
              switchMap(registrosAtuais => {
                  const index = registrosAtuais.findIndex(r => r.id === registroAtualizado.id);
                  
                  if (index > -1) {
                      const novaLista = [...registrosAtuais];
                      novaLista[index] = registroAtualizado;
                      
                      return from(this._storage!.set(STORAGE_KEY, novaLista)).pipe(
                          tap(() => this._registros.next(novaLista)),
                          map(() => novaLista)
                      );
                  }
                  
                  return of(registrosAtuais); 
              })
          );
  }
  
  excluirRegistro(id: number): Observable<RegistroFaísca[]> {
    if (!this._storage) {
        return of([]).pipe(tap(() => console.error('Storage não inicializado!')));
    }
      
    return this.registros$
      .pipe(
        take(1),
        switchMap(registrosAtuais => {
          const novaLista = registrosAtuais.filter(r => r.id !== id);
          return from(this._storage!.set(STORAGE_KEY, novaLista)).pipe(
            tap(() => this._registros.next(novaLista)),
            map(() => novaLista)
          );
        })
      );
  }
}