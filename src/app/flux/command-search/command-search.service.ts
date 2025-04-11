import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandSearchService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  
  isOpen$ = this.isOpenSubject.asObservable();

  constructor() { }

  openCommandSearch(): void {
    this.isOpenSubject.next(true);
  }

  closeCommandSearch(): void {
    this.isOpenSubject.next(false);
  }

  toggleCommandSearch(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }
}