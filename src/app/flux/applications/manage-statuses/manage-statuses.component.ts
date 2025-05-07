import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApplicationsService } from '../applications.service';

@Component({
  selector: 'app-manage-statuses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-statuses.component.html'
})
export class ManageStatusesComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  statusForm: FormGroup;
  statuses: any[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private applicationsService: ApplicationsService
  ) {
    this.statusForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#3B82F6', Validators.required]
    });
  }

  ngOnInit() {
    this.loadStatuses();
  }

  loadStatuses() {
    this.isLoading = true;
    this.applicationsService.getStatuses().subscribe({
      next: (statuses) => {
        this.statuses = statuses;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.statusForm.valid) {
      this.isLoading = true;
      this.applicationsService.createStatus(this.statusForm.value).subscribe({
        next: () => {
          this.statusForm.reset({ color: '#3B82F6' });
          this.loadStatuses();
        },
        error: (error) => {
          console.error('Error creating status:', error);
          this.isLoading = false;
        }
      });
    }
  }

  deleteStatus(id: number) {
    if (confirm('Are you sure you want to delete this status?')) {
      this.applicationsService.deleteStatus(id).subscribe({
        next: () => {
          this.loadStatuses();
        },
        error: (error) => {
          console.error('Error deleting status:', error);
        }
      });
    }
  }

  onCancel() {
    this.closeModal.emit();
  }

  onColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.statusForm.patchValue({ color: input.value });
  }
} 