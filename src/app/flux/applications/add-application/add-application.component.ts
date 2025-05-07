import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationsService } from '../applications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.css'
})
export class AddApplicationComponent implements OnInit {
  @Output() closeModal = new EventEmitter<boolean>();
  
  applicationForm: FormGroup;
  formSubmitted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  statuses: any[] = [];
  isEditMode: boolean = false;
  companies: any[] = [];

  @Input() application: any = null;

  employmentTypes = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'temporary', label: 'Temporary' }
  ];

  constructor(
    private fb: FormBuilder,
    private applicationsService: ApplicationsService,
    private router: Router
  ) {
    this.applicationForm = this.fb.group({
      title: ['', Validators.required],
      company_id: ['', Validators.required],
      location: [''],
      remote: [false],
      salary_min: [null],
      salary_max: [null],
      employment_type: [''],
      status_id: ['', Validators.required],
      application_date: ['', Validators.required],
      job_url: [''],
      description: [''],
      notes: [''],
      job_type: [''],
      salary: [''],
      interview_date: [''],
      job_posting_url: [''],
      contact_person: [''],
      contact_email: [''],
      contact_phone: ['']
    });
  }

  ngOnInit() {
    this.loadStatuses();
    this.loadCompanies();
    
    if (this.application) {
      this.isEditMode = true;
      // Format dates to YYYY-MM-DD for the date input
      const applicationDate = this.application.application_date ? 
        new Date(this.application.application_date).toISOString().split('T')[0] : '';
      const interviewDate = this.application.interview_date ? 
        new Date(this.application.interview_date).toISOString().split('T')[0] : '';

      // Patch the form with the application data
      this.applicationForm.patchValue({
        title: this.application.title,
        company_id: this.application.company?.id,
        location: this.application.location,
        remote: this.application.remote,
        salary_min: this.application.salary_min,
        salary_max: this.application.salary_max,
        employment_type: this.application.employment_type,
        status_id: this.application.status?.id,
        application_date: applicationDate,
        job_url: this.application.job_url,
        description: this.application.description,
        notes: this.application.notes,
        job_type: this.application.job_type,
        salary: this.application.salary,
        interview_date: interviewDate,
        job_posting_url: this.application.job_posting_url,
        contact_person: this.application.contact_person,
        contact_email: this.application.contact_email,
        contact_phone: this.application.contact_phone
      });
    }
  }

  loadStatuses() {
    this.applicationsService.getStatuses().subscribe({
      next: (statuses) => {
        this.statuses = statuses;
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
        this.errorMessage = 'Error loading statuses. Please try again.';
      }
    });
  }

  loadCompanies() {
    this.applicationsService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.errorMessage = 'Error loading companies. Please try again.';
      }
    });
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.applicationForm.valid) {
      this.isLoading = true;
      const formData = { ...this.applicationForm.value };

      const request$ = this.isEditMode
        ? this.applicationsService.updateApplication(this.application.id, formData)
        : this.applicationsService.createApplication(formData);

      request$.subscribe({
        next: () => {
          this.isLoading = false;
          this.closeModal.emit(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error saving application. Please try again.';
          console.error('Error saving application:', error);
        }
      });
    }
  }

  onCancel() {
    this.closeModal.emit(false);
  }
}
