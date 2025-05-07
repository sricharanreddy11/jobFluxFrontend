import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { Company } from '../organisations.models';
import { finalize } from 'rxjs/operators';
import { AddOrganisationComponent } from "../add-organisation/add-organisation.component";
import { FLuxAPIService } from '../../flux.service';
import { LoadingSpinnerComponent } from "../../../shared/loading-spinner/loading-spinner.component";
import { DeleteModalComponent } from '../../../shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-organisation-detail',
  standalone: true,
  imports: [
    DatePipe, 
    NgIf, 
    AddOrganisationComponent, 
    LoadingSpinnerComponent,
    DeleteModalComponent
  ],
  templateUrl: './organisation-detail.component.html',
  styleUrl: './organisation-detail.component.css'
})
export class OrganisationDetailComponent {
  constructor(private fluxAPISerice: FLuxAPIService) {}    
    isLoading = false;
    @Input() inputOrganisation: any;
    @Output() refresh = new EventEmitter<Company>();
    @Output() delete = new EventEmitter<Company>();
    showEditModal = false;
    showDeleteModal = false;
    organisation: any;

    
    ngOnChanges(): void {
      this.isLoading = true;
      this.organisation = this.fluxAPISerice.getOrganisationDetail(this.inputOrganisation.id).pipe(
        finalize(() => { this.isLoading = false; })
      ).subscribe(
        (data: Company) => {
          this.organisation = data;
        },
        (error) => {
          console.error('Error fetching organisation details:', error); 
    });
      }
  
    openEditModal(): void {
      this.showEditModal = true;
    }

    openAddModal(): void {
      this.showEditModal = true;
    }
  
    closeModal(): void {
      this.showEditModal = false;
   }

   refreshList(company: Company): void { 
    this.showEditModal = false;
    this.organisation = company;
    this.refresh.emit(company);
  }
  
    deleteCompany(company: Company): void {
      this.showDeleteModal = true;
    }

    onDeleteConfirm(): void {
      this.isLoading = true;
      this.delete.emit(this.organisation);
      this.isLoading = false;
      this.organisation = null;
      this.showDeleteModal = false;
    }

    onDeleteCancel(): void {
      this.showDeleteModal = false;
    }
}
