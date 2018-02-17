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
    this.authService.user.subscribe((user) => {
      if (user) {
        this.router.navigate(['/calendar']);
      } else {
        console.log("Need login")
      }
    }
    );
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

        this.router.navigate(['calendar']);
      })
      .catch((err) => console.log('error: ' + err));
  }

}
