import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthenticatorComponent } from "./authenticator/authenticator.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'jobflux_frontend';
}
