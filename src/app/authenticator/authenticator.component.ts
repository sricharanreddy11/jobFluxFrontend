import { Component, inject } from '@angular/core';
import { AuthenticatorService } from './authenticator.service';
import { NgFor, NgIf } from '@angular/common';
import { LoginComponent } from "./login/login.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authenticator',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './authenticator.component.html',
  styleUrl: './authenticator.component.css'
})
export class AuthenticatorComponent {
  constructor(private authService: AuthenticatorService){}


}
