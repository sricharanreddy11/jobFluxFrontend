import { DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AddOrganisationComponent } from "./add-organisation/add-organisation.component";
import { Company } from './organisations.models';
import { of } from 'rxjs';
import { FLuxAPIService } from '../flux.service';
import { OrganisationDetailComponent } from './organisation-detail/organisation-detail.component';


@Component({
  selector: 'app-organisations',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, FormsModule, DatePipe, AddOrganisationComponent, OrganisationDetailComponent],
  templateUrl: './organisations.component.html',
  styleUrl: './organisations.component.css'
})
export class OrganisationsComponent{
  isLoading = false;
  sortDirection = 'desc';
  showAddModal = false;
  searchTerm = new FormControl('');
  organisations: any[] = [];
  selectedOrganisation: any;
  

  constructor(private http: HttpClient, private fluxAPIService: FLuxAPIService) {
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
            this.organisations = apiData;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching organisations:', error);
            this.isLoading = false;
          }
        );
  }

  ngOnInit(): void {
    this.selectedOrganisation = null;
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading = true;
    this.fluxAPIService.getOrganisations()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.organisations = data;
          console.log('Companies loaded:', this.organisations);
        },
        error: (error) => console.error('Error loading companies', error)
      });
  }

  selectCompany(company: Company): void {
    this.selectedOrganisation = company;
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeModal(): void {
    this.showAddModal = false;
  }

  refreshList(updatedCompany: any): void {
    this.showAddModal = false;
    this.selectedOrganisation = updatedCompany;
    this.loadCompanies();
  }

  deleteCompany(company: Company): void {
    if (confirm(`Are you sure you want to delete ${company.name}?`)) {
      this.isLoading = true;
      this.fluxAPIService.deleteOrganisation(String(company.id))
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
          },
          error: (error) => console.error('Error deleting company', error)
        });
    }
  }

}