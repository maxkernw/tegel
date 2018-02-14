import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PasswordValidation } from './passwordValidation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  myform: FormGroup;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['calendar']);
    }
    this.myform = new FormGroup({
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.minLength(2)),
      confirmPassword: new FormControl('', Validators.minLength(2)),
    }, this.passwordMatchValidator)
  }
  passwordMatchValidator(g: FormGroup) {
    return g.value.password === g.value.confirmPassword
      ? { mismatch: false } : { 'mismatch': true };
  }

  onSubmit() {
    if (this.myform.valid) {
      this.authService.signUpRegular(this.myform.value.email, this.myform.value.password);
    }
  }



}
