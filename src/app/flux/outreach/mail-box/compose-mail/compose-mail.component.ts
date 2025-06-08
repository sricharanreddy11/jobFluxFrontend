import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compose-mail',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './compose-mail.component.html',
  styleUrl: './compose-mail.component.css'
})
export class ComposeMailComponent {

  @Output() closeModal = new EventEmitter<void>();
  @Output() sendMail = new EventEmitter<any>();
  showCc = false;
  showBcc = false;

  toggleCc() {
    this.showCc = !this.showCc;
  }

  toggleBcc() {
    this.showBcc = !this.showBcc;
  }
  
  prepareMail(formData: any) {
    if (!formData) return;
      const emailData = {
        subject: formData.subject,
        recipients: [formData.recipients],
        cc: formData.cc ? [formData.cc] : [],
        bcc: formData.bcc ? [formData.bcc] : [],
        message: formData.message
      };

      console.log('Sending email with data:', emailData);
      this.sendMail.emit(emailData);
      this.OnClose();
  }

  OnClose() {
    this.closeModal.emit();
  }
}
