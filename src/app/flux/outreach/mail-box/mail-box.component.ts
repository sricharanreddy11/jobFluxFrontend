import { Component } from '@angular/core';
import { OutreachService } from '../outreach.service';
import { DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MailThreadComponent } from './mail-thread/mail-thread.component';
import { OtherMailFormComponent } from "../other-mail-form/other-mail-form.component";
import { LoadingSpinnerComponent } from "../../../shared/loading-spinner/loading-spinner.component";
import { MailThreadDetailComponent } from "./mail-thread-detail/mail-thread-detail.component";
import { ComposeMailComponent } from "./compose-mail/compose-mail.component";

@Component({
  selector: 'app-mail-box',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, MailThreadComponent, OtherMailFormComponent, LoadingSpinnerComponent, MailThreadDetailComponent, ComposeMailComponent],
  templateUrl: './mail-box.component.html'
})
export class MailBoxComponent {
  mailBoxData: any;
  isLoading: boolean = true;
  public code: string | undefined;
  selectedFilter: string = 'sent';
  showComposeModal: boolean = false;
  isMailboxConnected: boolean = false;
  threadOwner: string = '';

  selectedThreadId: string | undefined;

  providers = [
    { id: 'google_mail', name: 'Gmail', icon: 'https://img.icons8.com/?size=100&id=P7UIlhbpWzZm&format=png&color=000000', description: 'Connect with your Google account' },
    { id: 'other_mail', name: 'Other Email', icon: 'https://img.icons8.com/?size=100&id=53388&format=png&color=000000', description: 'Connect any other email provider' },
  ];
  showOtherMailModal = false;
  
  mailFilters = [
    { id: 'sent', name: 'Sent', icon: 'paper-plane' },
    { id: 'inbox', name: 'Inbox', icon: 'inbox' },
    { id: 'trash', name: 'Trash', icon: 'trash' }
  ];
  
  constructor(
    private outreachService: OutreachService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
    });
  }
  
  ngOnInit(): void {
    console.log('MailBoxComponent', this.outreachService.mailBoxData);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.code) {
        this.authorizeWIthCode();
      } else {
        this.loadMailIntegrations();
      }
    }, 10);
  }

  public authorizeWIthCode() {
    if(this.code) {
      let body: any = {};
      body.authorization_code = this.code;
      const provider = localStorage.getItem('provider') || '';
      const params = {
        "provider": provider
      };
      this.outreachService.postAuthorizeMail(body, params).subscribe(
        res => {
          localStorage.removeItem('provider');
          this.loadMailIntegrations();
        },
        error => {
          console.error('Authorization error:', error);
        }
      );
    }
  }

  public loadMailIntegrations() {
    this.checkMailboxConnection();
    this.isLoading = false;
  }
  
  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.selectedThreadId = undefined;
  }
  
  toggleComposeModal() {
    this.showComposeModal = !this.showComposeModal;
  }
  
  handleSendMail(mailData: any) {
    console.log('Sending mail:', mailData);
    console.log('MailBoxData:', this.mailBoxData);
    mailData.sender = this.mailBoxData?.email || '';
    const provider = this.mailBoxData?.provider.name || '';
    const params = { provider };
    this.outreachService.sendMail(mailData, params).subscribe(
      response => {
        console.log('Mail sent successfully:', response);
        this.showComposeModal = false;
        this.loadMailIntegrations();
      },
      error => {
        console.error('Error sending mail:', error);
        this.showComposeModal = false;
      }
    );
  }

  checkMailboxConnection(): void {
    const paramsObj = {"status": "ACTIVE"}
    this.outreachService.getMailToken(paramsObj).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.isMailboxConnected = true;
          this.mailBoxData = res[0];
          this.threadOwner = this.mailBoxData.email;
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
    this.isLoading = true;
    console.log('Other Mail Form Data:', formData);
    let body: any = formData;
    const provider = "others_mail";
    const params = {
      "provider": provider
    };
    this.outreachService.postAuthorizeMail(body, params).subscribe(
      res => {
        this.loadMailIntegrations();
        this.isLoading = false;
      },
      error => {
        console.error('Authorization error:', error);
        this.isLoading = false;
      }
      
    );
  }

  getProviderIcon(providerId: string): string | null {
    const match = this.providers.find(p => p.id === providerId);
    return match?.icon || null;
  }

  handleThreadSelected(threadID: any): void {
    console.log('Selected Thread:', threadID);
    this.selectedThreadId = threadID;
  }

  clearSelectedThread(): void {
    this.selectedThreadId = undefined;
  }

  disconnectMailbox(): void {
    const data = {
      "token_id": this.mailBoxData.id,
      "status": "DISCONNECTED"
    };
    this.outreachService.disconnectMailToken(data).subscribe(
      (res) => {
        console.log('Mailbox disconnected:', res);
        this.isMailboxConnected = false;
        this.mailBoxData = {};
      }
    );  
  }
}