import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OutreachService } from './outreach.service';
import { OtherMailFormComponent } from "./other-mail-form/other-mail-form.component";
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-outreach',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './outreach.component.html',
  styleUrl: './outreach.component.css'
})
export class OutreachComponent {

  constructor(
    private outreachService: OutreachService,
    private router: Router
  ){}

  ngOnInit(): void {
  }

}
