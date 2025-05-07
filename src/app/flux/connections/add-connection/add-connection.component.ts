import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConnectionsService } from '../connections.service';
import { FLuxAPIService } from '../../flux.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-add-connection',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-connection.component.html',
  styleUrl: './add-connection.component.css'
})
export class AddConnectionComponent {
  @Output() closeModal = new EventEmitter<boolean>();
  
  connectionForm: FormGroup;
  companies: any[] = [];
  isLoading: boolean = false;
  showCompanyForm: boolean = false;
  companyForm: FormGroup;
  formSubmitted: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private connectionsService: ConnectionsService,
    private fluxAPIService: FLuxAPIService
  ) {
    this.connectionForm = this.fb.group({
      name: ['', Validators.required],
      position: [''],
      company_id: [null],
      email: ['', Validators.email],
      phone: [''],
      linkedin_url: ['', Validators.pattern(/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/)],
      notes: ['']
    });
    
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      website: [''],
      industry: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.fluxAPIService.getOrganisations().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (error) => console.error('Error fetching companies:', error)
    });
  }

  toggleCompanyForm(): void {
    this.showCompanyForm = !this.showCompanyForm;
    if (!this.showCompanyForm) {
      this.companyForm.reset();
    }
  }

  createCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    
    this.fluxAPIService.createOrganisation(this.companyForm.value).subscribe({
      next: (response) => {
        this.companies.push(response);
        this.connectionForm.patchValue({
          company_id: response.id
        });
        this.showCompanyForm = false;
        this.companyForm.reset();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating company:', error);
        this.isLoading = false;
      }
    });
  }

  submitForm(): void {
    this.formSubmitted = true;
    
    if (this.connectionForm.invalid) {
      this.connectionForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    
    this.connectionsService.createConnection(this.connectionForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeModal.emit(true);
      },
      error: (error) => {
        console.error('Error creating connection:', error);
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.closeModal.emit(false);
  }
}
