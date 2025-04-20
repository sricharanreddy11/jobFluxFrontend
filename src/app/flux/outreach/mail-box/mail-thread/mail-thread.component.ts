import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mail-thread',
  standalone: true,
  imports: [],
  templateUrl: './mail-thread.component.html',
  styleUrl: './mail-thread.component.css'
})
export class MailThreadComponent {
  @Input() filter: string = 'inbox';

}
