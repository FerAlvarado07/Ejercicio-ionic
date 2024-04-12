import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SignupService } from 'src/app/services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private authService: AuthService,
    private signupService: SignupService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])],
    });
  }
  error: boolean = false;

  ngOnInit() {}

  signup() {
    if (
      this.form.valid &&
      this.form.get('password')?.value ===
        this.form.get('confirmPassword')?.value
    ) {
      const name = this.form.get('name')?.value;

      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      this.signupService.createUser(name, email, password);
      this.signupService.redirectSignupHome();
    } else {
      this.error = true;
    }
  }
}
