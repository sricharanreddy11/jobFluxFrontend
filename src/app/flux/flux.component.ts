import { Component } from '@angular/core';
import { AuthenticatorService } from '../authenticator/authenticator.service';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NgClass } from '@angular/common';
import { CommandSearchComponent } from './command-search/command-search.component';

@Component({
  selector: 'app-flux',
  standalone: true,
  imports: [NavbarComponent, RouterModule, NgClass, CommandSearchComponent],
  templateUrl: './flux.component.html',
  styleUrl: './flux.component.css'
})
export class FluxComponent {
  constructor(
    private authService: AuthenticatorService,
    private router: Router
  ){}

  isSidebarToggled: boolean = false;

  ngOnInit(): void {
  }

  onToggleView() {
    this.isSidebarToggled = !this.isSidebarToggled;
  }

  onLogout(){
    this.authService.logout();
    location.reload();
  }
}
