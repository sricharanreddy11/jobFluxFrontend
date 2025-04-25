import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compose-mail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './compose-mail.component.html',
  styleUrl: './compose-mail.component.css'
})
export class ComposeMailComponent {

  @Output() closeModal = new EventEmitter<void>();

  
  sendMail(mailData: any) {
    console.log('Sending mail:', mailData);
  }

  OnClose() {
    this.closeModal.emit();
  }
}
