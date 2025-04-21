import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { OutreachService } from '../../outreach.service';
import { ComposeMailComponent } from "../compose-mail/compose-mail.component";
import { ReplyMailComponent } from "./reply-mail/reply-mail.component";

@Component({
  selector: 'app-mail-thread-detail',
  standalone: true,
  imports: [NgFor, NgIf, ReplyMailComponent],
  templateUrl: './mail-thread-detail.component.html',
  styleUrl: './mail-thread-detail.component.css'
})
export class MailThreadDetailComponent {
  constructor(    
    private sanitizer: DomSanitizer,
    private outreachService: OutreachService,
  ) { 
  }

  @Input() threadId: any;
  threadData: any;
  showReplyComponent: boolean = false;

  @Output() closeThread = new EventEmitter<void>();

  ngOnChanges(): void {
    this.getThreadDetails();
  }

  getThreadDetails() {
    console.log('Thread ID:', this.threadId);
    // this.threadData = {
    //   "id": 5,
    //   "emails": [{
    //     "id": 4,
    //     "user_id": "2",
    //     "created_at": "2025-04-11T06:42:14.731363Z",
    //     "updated_at": "2025-04-11T06:42:14.731424Z",
    //     "message_id": "<2025-04-11 06:42:14222995-2-codedbycharan>",
    //     "internet_message_id": "<2025-04-11 06:42:14222995-2-codedbycharan>",
    //     "sender": "codedbycharan@gmail.com",
    //     "recipients": ["sricharan.reddy@thriwin.io"],
    //     "cc": [],
    //     "bcc": [],
    //     "subject": "Testing Job Flux Sync",
    //     "is_external": false,
    //     "body": "<div> <img src={tracking_url} style=\"display: none\" class=\"no-display-image\"/> <p class=\"adjoint-paragraph\" style=\"margin: 0px;\">Hello,</p><p class=\"adjoint-paragraph\" style=\"margin: 0px;\">Testing Job Flux Sync</p> </div> ",
    //     "time_stamp": 1744353728760,
    //     "mail_status": "SENDING",
    //     "is_read": true,
    //     "is_starred": false,
    //     "is_archived": false,
    //     "is_scheduled": false,
    //     "meta": {
    //         "provider": {
    //             "name": "others_mail"
    //         }
    //     },
    //     "mail_created_time": "2025-04-11T06:42:14.223347Z",
    //     "thread": 5
    //   }],
    //   "created_at": "2025-04-11T06:42:14.721032Z",
    //   "updated_at": "2025-04-11T06:42:14.734341Z",
    //   "thread_id": "<2025-04-11 06:42:14222995-2-codedbycharan>",
    //   "sender": "codedbycharan@gmail.com",
    //   "user_id": "2",
    //   "participants": {},
    //   "is_trash": false,
    //   "is_read": false,
    //   "is_sent": true,
    //   "is_inbox": false,
    //   "is_draft": false,
    //   "last_active_time": "2025-04-11T06:42:14.717960Z",
    //   "size": 1,
    //   "thread_owner": "codedbycharan@gmail.com",
    //   "meta_data": {},
    //   "provider": 1,
    //   "latest_message": 4
    // };
    this.outreachService.getMails({ thread_id: this.threadId }).subscribe(
      (response: any) => {
        this.threadData = response[0];
        console.log('Selected Thread:', this.threadData);
      },
      (error) => {
        this.threadData = {};
        console.error('Error fetching thread details:', error);
      }
    );
  }

  goBack() { 
    this.closeThread.emit();
   }

  getInitials(email: string): string {
    if (!email) return '';
    return email.split('@')[0].charAt(0).toUpperCase();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    // Format: Apr 11, 2025, 6:42 AM
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  }

  sanitizeHtml(html: string): SafeHtml {
    // This ensures the HTML is sanitized before being displayed
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  openReplyComponent(): void {
    this.showReplyComponent = true;
  }

  closeReplyComponent(): void {
    this.showReplyComponent = false;
  }
}
