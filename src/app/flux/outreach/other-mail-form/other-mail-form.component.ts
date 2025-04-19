import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-other-mail-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './other-mail-form.component.html',
  styleUrl: './other-mail-form.component.css'
})
export class OtherMailFormComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  
  mailForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.mailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      imapServer: ['', Validators.required],
      imapServerPort: ['993', [Validators.required, Validators.pattern('^[0-9]+$')]],
      smtpServer: ['', Validators.required],
      smtpServerPort: ['587', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }
  
  onSubmit(): void {
    if (this.mailForm.valid) {
      this.formSubmit.emit(this.mailForm.value);
    } else {
      this.markFormGroupTouched(this.mailForm);
    }
  }
  
  onCancel(): void {
    this.formCancel.emit();
  }
  
  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
