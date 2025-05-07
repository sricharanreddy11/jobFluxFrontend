import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationsService } from '../applications.service';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { AddApplicationComponent } from '../add-application/add-application.component';
import { DeleteModalComponent } from '../../../shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule, 
    DatePipe, 
    CurrencyPipe, 
    LoadingSpinnerComponent, 
    AddApplicationComponent,
    DeleteModalComponent
  ],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.css'
})
export class ApplicationDetailComponent implements OnInit {
  application: any = null;
  isLoading = true;
  errorMessage = '';
  showEditModal = false;
  showDeleteModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationsService: ApplicationsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApplication(parseInt(id));
    }
  }

  loadApplication(id: number): void {
    this.isLoading = true;
    this.applicationsService.getApplication(id).subscribe({
      next: (data) => {
        this.application = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading application details';
        this.isLoading = false;
        console.error('Error loading application:', error);
      }
    });
  }

  getEmploymentTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'full_time': 'Full-time',
      'part_time': 'Part-time',
      'contract': 'Contract',
      'freelance': 'Freelance',
      'internship': 'Internship'
    };
    return types[type] || type;
  }

  getTaskStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  onBack(): void {
    this.router.navigate(['/flux/applications']);
  }

  onEdit(): void {
    this.showEditModal = true;
  }

  onEditModalClose(success: boolean): void {
    this.showEditModal = false;
    if (success && this.application?.id) {
      // Reload the application data after successful edit
      this.loadApplication(this.application.id);
    }
  }

  onDelete(): void {
    this.showDeleteModal = true;
  }

  onDeleteConfirm(): void {
    this.applicationsService.deleteApplication(this.application.id).subscribe({
      next: () => {
        this.router.navigate(['/flux/applications']);
      },
      error: (error) => {
        this.errorMessage = 'Error deleting application';
        console.error('Error deleting application:', error);
        this.showDeleteModal = false;
      }
    });
  }

  onDeleteCancel(): void {
    this.showDeleteModal = false;
  }
}
