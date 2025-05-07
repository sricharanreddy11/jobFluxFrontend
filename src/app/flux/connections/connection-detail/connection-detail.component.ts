import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FLuxAPIService } from '../../flux.service';
import { ConnectionsService } from '../connections.service';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { DeleteModalComponent } from '../../../shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-connection-detail',
  standalone: true,
  imports: [
    NgIf, 
    ReactiveFormsModule, 
    FormsModule, 
    DatePipe, 
    CommonModule,
    DeleteModalComponent
  ],
  templateUrl: './connection-detail.component.html',
  styleUrl: './connection-detail.component.css'
})
export class ConnectionDetailComponent {
  connectionId: number;
  connection: any = null;
  companies: any[] = [];
  isLoading: boolean = true;
  isEditing: boolean = false;
  showDeleteModal: boolean = false;
  editForm: FormGroup;
  emailHistory: any[] = [];
  activities: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private connectionsService: ConnectionsService,
    private fluxAPIService: FLuxAPIService,
    private fb: FormBuilder
  ) { 
    const idParam = this.route.snapshot.paramMap.get('id');
    this.connectionId = idParam ? +idParam : 0;
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      position: [''],
      company_id: [null],
      email: ['', Validators.email],
      phone: [''],
      linkedin_url: ['', Validators.pattern(/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/)],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadConnectionDetails();
    this.loadCompanies();
    
    // Mock data for history and activities
    this.generateMockData();
  }

  loadConnectionDetails(): void {
    this.isLoading = true;
    this.connectionsService.getConnection(this.connectionId).subscribe({
      next: (data) => {
        this.connection = data;
        this.populateEditForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching connection details:', error);
        this.isLoading = false;
      }
    });
  }

  populateEditForm(): void {
    this.editForm.patchValue({
      name: this.connection.name,
      position: this.connection.position,
      company_id: this.connection.company?.id,
      email: this.connection.email,
      phone: this.connection.phone,
      linkedin_url: this.connection.linkedin_url,
      notes: this.connection.notes
    });
  }

  loadCompanies(): void {
    this.fluxAPIService.getOrganisations().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (error) => console.error('Error fetching companies:', error)
    });
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.populateEditForm();
    }
    this.isEditing = !this.isEditing;
  }

  generateMockData(): void {
    // Mock meeting history
    this.emailHistory = [
      { 
        date: new Date(2025, 3, 15), 
        type: 'Coffee Chat', 
        notes: 'Discussed potential job opportunities at their company. Follow up in two weeks.' 
      },
      { 
        date: new Date(2025, 2, 22), 
        type: 'Initial Introduction', 
        notes: 'Met at the tech conference. Showed interest in our product.' 
      }
    ];

    // Mock activity timeline
    this.activities = [
      { 
        date: new Date(2025, 3, 20), 
        type: 'Email', 
        description: 'Sent follow-up email about job application' 
      },
      { 
        date: new Date(2025, 3, 15), 
        type: 'Meeting', 
        description: 'Had coffee meeting to discuss opportunities' 
      },
      { 
        date: new Date(2025, 3, 10), 
        type: 'LinkedIn', 
        description: 'Connected on LinkedIn' 
      },
      { 
        date: new Date(2025, 3, 5), 
        type: 'Note', 
        description: 'Added contact information after conference' 
      }
    ];
  }

  saveChanges(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formValue = this.editForm.value;
    const updatedConnection = {
      ...this.connection,
      name: formValue.name,
      position: formValue.position,
      company_id: formValue.company_id,
      email: formValue.email,
      phone: formValue.phone,
      linkedin_url: formValue.linkedin_url,
      notes: formValue.notes
    };

    this.connectionsService.updateConnection(this.connectionId, updatedConnection).subscribe({
      next: (response) => {
        this.connection = response;
        this.isEditing = false;
      },
      error: (error) => console.error('Error updating connection:', error)
    });
  }

  deleteConnection(): void {
    this.showDeleteModal = true;
  }

  onDeleteConfirm(): void {
    this.connectionsService.deleteConnection(this.connectionId).subscribe({
      next: () => {
        this.router.navigate(['/flux/connections']);
      },
      error: (error) => {
        console.error('Error deleting connection:', error);
        this.showDeleteModal = false;
      }
    });
  }

  onDeleteCancel(): void {
    this.showDeleteModal = false;
  }

  navigateBack(): void {
    this.router.navigate(['/flux/connections']);
  }
}
