import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isNavbarCollapsed: boolean
  constructor(private authService: AuthService) {}

  logout(){
    this.authService.logout();
  }
  isLogged() {
    return this.authService.isLoggedIn();
  }
}
