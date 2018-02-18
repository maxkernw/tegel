import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('collapse', [
      state('open', style({
        opacity: '1',
        display: 'block',
        transform: 'translate3d(0, 0, 0)'
      })),
      state('closed',   style({
        opacity: '0',
        display: 'none',
        transform: 'translate3d(0, -100%, 0)'
      })),
      transition('closed => open', animate('200ms ease-in')),
      transition('open => closed', animate('100ms ease-out'))
    ])
  ]
})
export class AppComponent {
  isNavbarCollapsed = true;
  collapse:string = "closed";

  toggleCollapse() {
    this.collapse = this.collapse == "open" ? 'closed' : 'open';

  }
  constructor(private authService: AuthService) {}

  logout(){
    this.authService.logout();
  }
  isLogged() {
    return this.authService.isLoggedIn();
  }
}
