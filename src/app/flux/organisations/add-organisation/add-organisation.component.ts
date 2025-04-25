import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company } from '../organisations.models';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { FLuxAPIService } from '../../flux.service';

@Component({
  selector: 'app-add-organisation',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './add-organisation.component.html',
  styleUrl: './add-organisation.component.css'
})
export class AddOrganisationComponent {
  @Input() company: Company | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<any>();

  companyForm: FormGroup;
  isLoading = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private fluxAPIService: FLuxAPIService
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      website: ['', Validators.pattern('https?://.+')],
      description: [''],
      industry: ['']
    });
  }

  ngOnInit(): void {
    this.isEditing = !!this.company;
    
    if (this.company) {
      this.companyForm.patchValue({
        name: this.company.name,
        website: this.company.website,
        description: this.company.description,
        industry: this.company.industry
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.companyForm.invalid) return;

    const companyData = this.companyForm.value;
    this.isLoading = true;

    if (this.isEditing && this.company) {
      // Update existing company
      this.fluxAPIService.updateOrganisation(companyData, String(this.company.id))
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (updatedCompany) => {
            this.refresh.emit(updatedCompany);
          },
          error: (error) => console.error('Error updating company', error)
        });
    } else {
      // Create new company
      this.fluxAPIService.createOrganisation(companyData)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (newCompany) => {
            this.refresh.emit(newCompany);
          },
          error: (error) => console.error('Error creating company', error)
        });
    }
  }
}
