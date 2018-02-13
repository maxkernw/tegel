import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router?: Router) { }

  ngOnInit() {
    console.log(this.authService.isLoggedIn())
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['calendar']);
    }
  }

  signInWithFacebook() {
    this.authService.signInWithFacebook()
    .then((res) => {
        this.router.navigate(['calendar']);
      })
    .catch((err) => console.log(err));
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
    .then((res) => {
        this.router.navigate(['calendar']);
      })
    .catch((err) => console.log(err));
  }

}
