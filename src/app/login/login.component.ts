import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {
    email: '',
    password: ''
  };
  myform: FormGroup;

  constructor(private authService: AuthService, private router?: Router) { }

  ngOnInit() {
    this.myform = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });

    if (this.authService.isLoggedIn()) {
      console.log(this.authService.isLoggedIn())
      this.router.navigate(['calendar']);
    }
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle()
      .then((res) => {
        this.router.navigate(['calendar']);
      })
      .catch((err) => console.log(err));
  }

  signInWithEmail(): void {
    this.authService.signInRegular(this.myform.value.email, this.myform.value.password)
      .then((res) => {
        console.log(res);

        this.router.navigate(['calendar']);
      })
      .catch((err) => console.log('error: ' + err));
  }

}
