import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, debounceTime, distinctUntilChanged, startWith, tap, switchMap, of } from 'rxjs';
import { ApplicationsService } from '../applications.service';
import { AddApplicationComponent } from "../add-application/add-application.component";
import { ManageStatusesComponent } from "../manage-statuses/manage-statuses.component";
import { LoadingSpinnerComponent } from "../../../shared/loading-spinner/loading-spinner.component";
import { NgFor, NgIf, DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    AddApplicationComponent,
    ManageStatusesComponent,
    LoadingSpinnerComponent,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.css'
})
export class ApplicationListComponent implements OnInit {
  applications: any[] = [];
  searchTerm = new FormControl('');
  showAddModal: boolean = false;
  showStatusModal: boolean = false;
  isLoading: boolean = true;
  hasStatuses: boolean = false;
  selectedApplication: any = null;

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
        console.error('Error fetching applications:', error);
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.checkStatuses();
  }

  checkStatuses(): void {
    this.applicationsService.getStatuses().subscribe({
      next: (statuses) => {
        this.hasStatuses = statuses.length > 0;
        if (this.hasStatuses) {
          this.loadApplications();
        }
      },
      error: (error) => {
        console.error('Error checking statuses:', error);
        this.hasStatuses = false;
      }
    });
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
    if (!this.hasStatuses) {
      alert('Please configure application statuses first');
      this.showStatusModal = true;
      return;
    }
    this.showAddModal = true;
  }

  editApplication(application: any) {
    this.selectedApplication = application;
    this.showAddModal = true;
  }

  onModalClose() {
    this.showAddModal = false;
    this.selectedApplication = null;
    this.loadApplications();
  }

  openStatusModal(): void {
    this.showStatusModal = true;
  }

  closeStatusModal(refresh: any = false): void {
    this.showStatusModal = false;
    if (refresh) {
      this.checkStatuses();
    }
  }

  deleteApplication(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this Application?')) {
      this.applicationsService.deleteApplication(id).subscribe({
        next: () => {
          this.loadApplications();
          console.log('Application deleted successfully');
        },
        error: (error) => console.error('Error deleting Application:', error)
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'offered':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getEmploymentTypeLabel(type: string): string {
    switch (type?.toLowerCase()) {
      case 'full_time':
        return 'Full Time';
      case 'part_time':
        return 'Part Time';
      case 'contract':
        return 'Contract';
      case 'internship':
        return 'Internship';
      case 'temporary':
        return 'Temporary';
      default:
        return type || 'Not specified';
    }
  }
}
