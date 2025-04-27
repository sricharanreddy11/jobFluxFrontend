import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, debounceTime, distinctUntilChanged, startWith, tap, switchMap, of } from 'rxjs';
import { ApplicationsService } from '../applications.service';
import { AddApplicationComponent } from "../add-application/add-application.component";
import { LoadingSpinnerComponent } from "../../../shared/loading-spinner/loading-spinner.component";
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [AddApplicationComponent, LoadingSpinnerComponent, NgIf, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.css'
})
export class ApplicationListComponent {
  applications: any[] = [];
  searchTerm = new FormControl('');
  
  showAddModal: boolean = false;
  isLoading: boolean = true;

  constructor(
    private applicationsService: ApplicationsService,
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
                  return this.applicationsService.getApplications();
                } else if (searchTerm.length >= 3) {
                  return this.applicationsService.getApplications({ search: searchTerm });
                } else {
                  this.isLoading = false;
                  return of([]);
                }
              })
            ).subscribe(
              (apiData: any[]) => {
                this.applications = apiData;
                this.isLoading = false;
              },
              (error) => {
                console.error('Error fetching organisations:', error);
                this.isLoading = false;
              }
            );
   }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.applicationsService.getApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching Applications:', error);
        this.isLoading = false;
      }
    });
  }

  viewApplicationDetail(id: number): void {
    this.router.navigate(['/flux/applications', id]);
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(refresh: any = false): void {
    this.showAddModal = false;
    if (refresh) {
      this.loadApplications();
    }
  }

  deleteApplication(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this Application?')) {
      this.applicationsService.deleteApplication(id).subscribe({
        next: () => console.log('Application deleted successfully'),
        error: (error) => console.error('Error deleting Application:', error)
      });
    }
  }
}
