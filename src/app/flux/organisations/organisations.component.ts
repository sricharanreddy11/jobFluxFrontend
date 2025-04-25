import { DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AddOrganisationComponent } from "./add-organisation/add-organisation.component";
import { Company } from './organisations.models';
import { of } from 'rxjs';
import { FLuxAPIService } from '../flux.service';
import { OrganisationsService } from './organisations.service';


@Component({
  selector: 'app-organisations',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, FormsModule, DatePipe, AddOrganisationComponent],
  templateUrl: './organisations.component.html',
  styleUrl: './organisations.component.css'
})
export class OrganisationsComponent{
  isLoading = false;
  sortDirection = 'desc';
  showAddModal = false;
  companyToEdit: Company | null = null;
  searchTerm = new FormControl('');
  

  constructor(private http: HttpClient, private fluxAPIService: FLuxAPIService, public organisationService: OrganisationsService) {
    this.searchTerm.valueChanges.pipe(
          map(value => value?.trim()),
          debounceTime(300),
          distinctUntilChanged(),
          startWith(''),
          tap(() => this.isLoading = true),
          switchMap(searchTerm => {
            if (!searchTerm || searchTerm.length === 0) {
              return this.fluxAPIService.getOrganisations();
            } else if (searchTerm.length >= 3) {
              return this.fluxAPIService.getOrganisations({ search: searchTerm });
            } else {
              this.isLoading = false;
              return of([]);
            }
          })
        ).subscribe(
          (apiData: Company[]) => {
            this.organisationService.organisations = apiData;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching organisations:', error);
            this.isLoading = false;
          }
        );
  }

  ngOnInit(): void {
    this.organisationService.selectedOrganisation = null;
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading = true;
    this.fluxAPIService.getOrganisations()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.organisationService.organisations = data;
          console.log('Companies loaded:', this.organisationService.organisations);
        },
        error: (error) => console.error('Error loading companies', error)
      });
  }

  selectCompany(company: Company): void {
    this.organisationService.selectedOrganisation = company;
  }

  openAddModal(): void {
    this.companyToEdit = null;
    this.showAddModal = true;
  }

  openEditModal(company: Company): void {
    this.companyToEdit = company;
    this.showAddModal = true;
  }

  closeModal(): void {
    this.showAddModal = false;
    this.companyToEdit = null;
  }

  refreshList(updatedCompany: any): void {
    this.showAddModal = false;
    this.companyToEdit = null;
    this.organisationService.selectedOrganisation = updatedCompany;
    this.loadCompanies();
  }

  deleteCompany(company: Company): void {
    if (confirm(`Are you sure you want to delete ${company.name}?`)) {
      this.isLoading = true;
      this.http.delete(`/api/companies/${company.id}/`)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
          },
          error: (error) => console.error('Error deleting company', error)
        });
    }
  }

}