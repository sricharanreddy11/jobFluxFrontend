import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reply-mail',
  standalone: true,
  imports: [],
  templateUrl: './reply-mail.component.html',
  styleUrl: './reply-mail.component.css'
})
export class ReplyMailComponent {
  currentUserEmail: string = 'your.email@example.com'; // Replace with actual user email
    
  replyTo: string[] = [];
  replyCc: string[] = [];
  replyBcc: string[] = [];

  @Input() subject: string = '';
  @Output() closeModal = new EventEmitter<void>();

constructor() {}

addRecipient(event: any, type: 'to' | 'cc' | 'bcc'): void {
  const value = event.target.value.trim();
  if (!value) return;

  switch (type) {
    case 'to':
      if (!this.replyTo.includes(value)) {
        this.replyTo.push(value);
      }
      break;
    case 'cc':
      if (!this.replyCc.includes(value)) {
        this.replyCc.push(value);
      }
      break;
    case 'bcc':
      if (!this.replyBcc.includes(value)) {
        this.replyBcc.push(value);
      }
      break;
  }

  // Clear the input field
  event.target.value = '';
  event.preventDefault();
}

removeRecipient(type: 'to' | 'cc' | 'bcc', index: number): void {
  switch (type) {
    case 'to':
      this.replyTo.splice(index, 1);
      break;
    case 'cc':
      this.replyCc.splice(index, 1);
      break;
    case 'bcc':
      this.replyBcc.splice(index, 1);
      break;
  }
}

closeReplyComponent(): void {    
  this.closeModal.emit();
}
}
