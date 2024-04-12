import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SignupService } from 'src/app/services/signup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private signupService: SignupService
  ) {
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    localStorage.clear();
  }

  login() {
    if (this.form.valid) {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;

      this.submitLogin(email, password);
      this.form.get('email')?.reset();
      this.form.get('password')?.reset();
    }
  }

  user = {};
  error: boolean = false;

  redirectSignup() {
    this.signupService.redirectSignup();
  }

  submitLogin(email: string, password: string): void {
    if (this.authService.login(email, password)) {
      this.authService.login(email, password).subscribe((user) => {
        if (user.id === undefined) {
          this.error = true;
          console.warn('Credenciales incorrectas');
        } else {
          console.log('El usuario que se logeo:', user.id);
          localStorage.setItem('id', user.id);
        }
      });
    }
  }
}
