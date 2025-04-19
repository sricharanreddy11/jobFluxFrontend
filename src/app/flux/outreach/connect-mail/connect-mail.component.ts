import { Component } from '@angular/core';
import { OutreachService } from '../outreach.service';
import { Router } from '@angular/router';
import { OtherMailFormComponent } from "../other-mail-form/other-mail-form.component";
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-connect-mail',
  standalone: true,
  imports: [OtherMailFormComponent, NgIf, NgFor],
  templateUrl: './connect-mail.component.html',
  styleUrl: './connect-mail.component.css'
})
export class ConnectMailComponent {
  isMailboxConnected: boolean = false;
  providers = [
    { id: 'google_mail', name: 'Gmail', icon: 'https://img.icons8.com/?size=100&id=P7UIlhbpWzZm&format=png&color=000000', description: 'Connect with your Google account' },
    { id: 'other_mail', name: 'Other Email', icon: 'https://img.icons8.com/?size=100&id=53388&format=png&color=000000', description: 'Connect any other email provider' },
  ];
  showOtherMailModal = false;

  constructor(
    private outreachService: OutreachService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkMailboxConnection();
  }

  checkMailboxConnection(): void {
    const paramsObj = {"status": "ACTIVE"}
    this.outreachService.getMailToken(paramsObj).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.isMailboxConnected = true;
          this.outreachService.mailBoxData = res[0];
          this.router.navigate(['flux/outreach/mail-box']);
        } else {
          this.isMailboxConnected = false;
        }
      },
      error => {
        console.error('Error checking mailbox connection:', error);
        this.isMailboxConnected = false;
      }
    );
  }

  connectProvider(providerId: string): void {
    if (providerId === 'other_mail') {
      this.showOtherMailModal = true;
    }
    else{
      const paramsObj = {"provider": providerId}
      this.outreachService.getAuthorizeUrl(paramsObj).subscribe(
        response => {
          localStorage.setItem('provider', providerId);
          window.location.href = response.redirect_url;
        },
        error => {
          console.error('Error getting auth URL:', error);
        }
      );
    }
  }

  closeOtherMailModal(): void {
    this.showOtherMailModal = false;
  }

  handleOtherMailSubmit(formData: any): void {
    this.showOtherMailModal = false;
    const queryParams = new URLSearchParams(formData).toString();
    this.router.navigate(['/mail-box'], { queryParams: formData });
  }
}
