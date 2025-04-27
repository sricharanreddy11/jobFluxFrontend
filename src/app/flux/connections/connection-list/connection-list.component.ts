import { Component } from '@angular/core';
import { ConnectionsService } from '../connections.service';
import { Router } from '@angular/router';
import { AddConnectionComponent } from "../add-connection/add-connection.component";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { map, debounceTime, distinctUntilChanged, startWith, tap, switchMap, of } from 'rxjs';
import { Company } from '../../organisations/organisations.models';
import { LoadingSpinnerComponent } from "../../../shared/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-connection-list',
  standalone: true,
  imports: [AddConnectionComponent, ReactiveFormsModule, NgIf, FormsModule, NgFor, LoadingSpinnerComponent],
  templateUrl: './connection-list.component.html',
  styleUrl: './connection-list.component.css'
})
export class ConnectionListComponent {
  connections: any[] = [];
  searchTerm = new FormControl('');
  
  showAddModal: boolean = false;
  isLoading: boolean = true;

  constructor(
    private connectionsService: ConnectionsService,
    private router: Router
  ) {
    this.searchTerm.valueChanges.pipe(
              map(value => value?.trim()),
              debounceTime(300),
              distinctUntilChanged(),
              startWith(''),
              tap(() => this.isLoading = true),
              switchMap(searchTerm => {
                if (!searchTerm || searchTerm.length === 0) {
                  return this.connectionsService.getConnections();
                } else if (searchTerm.length >= 3) {
                  return this.connectionsService.getConnections({ search: searchTerm });
                } else {
                  this.isLoading = false;
                  return of([]);
                }
              })
            ).subscribe(
              (apiData: any[]) => {
                this.connections = apiData;
                this.isLoading = false;
              },
              (error) => {
                console.error('Error fetching organisations:', error);
                this.isLoading = false;
              }
            );
   }

  ngOnInit(): void {
    this.loadConnections();
  }

  loadConnections(): void {
    this.isLoading = true;
    this.connectionsService.getConnections().subscribe({
      next: (data) => {
        this.connections = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching connections:', error);
        this.isLoading = false;
      }
    });
  }

  viewConnectionDetail(id: number): void {
    this.router.navigate(['/flux/connections', id]);
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(refresh: boolean = false): void {
    this.showAddModal = false;
    if (refresh) {
      this.loadConnections();
    }
  }

  deleteConnection(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this connection?')) {
      this.connectionsService.deleteConnection(id).subscribe({
        next: () => console.log('Connection deleted successfully'),
        error: (error) => console.error('Error deleting connection:', error)
      });
    }
  }
}

