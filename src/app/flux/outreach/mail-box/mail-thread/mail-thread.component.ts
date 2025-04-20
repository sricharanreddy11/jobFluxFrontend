import { Component, Input } from '@angular/core';
import { OutreachService } from '../../outreach.service';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mail-thread',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CommonModule, RouterModule],
  templateUrl: './mail-thread.component.html',
  styleUrl: './mail-thread.component.css'
})
export class MailThreadComponent {
  @Input() filter: string = 'sent';
  @Input() thread_owner: string = '';

  public mailThreads: any[] = []

  constructor
  (
    private outreachService: OutreachService
  ) {}

  ngOnChanges(): void {
    this.getThreads();
  }

  public getThreads(){
    const params = {
      thread_owner: this.thread_owner,
      viewType: this.filter,
      is_sent: this.filter === 'sent',
      is_inbox: this.filter === 'inbox',
      is_trash: this.filter === 'trash',
    }
    this.outreachService.getMailThreads(params).subscribe(
      (response: any) => {
        this.mailThreads = response;
        console.log('Mail Threads:', this.mailThreads);
      }
    );
  }

  public moveToTrash(thread: any) {
    // // Prevent navigation when clicking the trash button
    // event?.stopPropagation();
    
    // // Implementation will depend on your OutreachService
    // // This is just a placeholder
    // this.outreachService.moveThreadToTrash(thread.id).subscribe(
    //   () => {
    //     // Remove from current list if successful
    //     this.mailThreads = this.mailThreads.filter(t => t.id !== thread.id);
    //   },
    //   (error) => {
    //     console.error('Error moving thread to trash:', error);
    //   }
    // );
  }

}
