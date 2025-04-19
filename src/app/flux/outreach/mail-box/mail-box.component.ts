import { Component } from '@angular/core';
import { OutreachService } from '../outreach.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface MailThread {
  id: string;
  subject: string;
  participants: string[];
  preview: string;
  unread: boolean;
  lastMessageDate: Date;
  messageCount: number;
}

interface Mail {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  content: string;
  date: Date;
  attachments: any[];
}

@Component({
  selector: 'app-mail-box',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf],
  templateUrl: './mail-box.component.html',
  styleUrl: './mail-box.component.css'
})
export class MailBoxComponent {
  threads: MailThread[] = [];
  selectedThread: MailThread | null = null;
  mails: Mail[] = [];
  isLoading: boolean = false;
  public code:string | undefined;

  
  constructor(private outreachService: OutreachService,
     private activatedRoute:ActivatedRoute,
     private router:Router,
  ) {
    this.activatedRoute.queryParams.subscribe(params =>{
      this.code = params['code'];
    })
  }
  
  ngOnInit(): void {
    console.log('MailBoxComponent', this.outreachService.mailBoxData);
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      if(this.code){
        this.authorizeWIthCode();
      }
      else{
        this.loadMailIntegrations();
      }
      
    },10)  
  }

  public authorizeWIthCode(){
    if(this.code){
      let body:any = {}
      body.authorization_code = this.code;
      const provider = localStorage.getItem('provider') || '';
      const params = {
        "provider": provider};
      this.outreachService.postAuthorizeMail(body, params).subscribe(res =>{
        localStorage.removeItem('provider');
      },
      error=>{
        
      }
      )
    }
  }

  public loadMailIntegrations(){

  }
  
  selectThread(thread: MailThread): void {
    this.selectedThread = thread;
    this.loadMailsForThread(thread.id);
  }
  
  loadMailsForThread(threadId: string): void {
    this.isLoading = true;
    this.outreachService.getMails(threadId).subscribe(
      mails => {
        this.mails = mails;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading mails for thread:', error);
        this.isLoading = false;
      }
    );
  }
}
