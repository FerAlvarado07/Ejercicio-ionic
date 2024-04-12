import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login.page';
import { AuthService } from 'src/app/services/auth.service';
import { SignupService } from 'src/app/services/signup.service';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let signupServiceSpy: jasmine.SpyObj<SignupService>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['login']);
    const signupServiceSpyObj = jasmine.createSpyObj('SignupService', [
      'redirectSignup',
    ]);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: SignupService, useValue: signupServiceSpyObj },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    signupServiceSpy = TestBed.inject(
      SignupService
    ) as jasmine.SpyObj<SignupService>;
    formBuilder = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call submitLogin and reset form on valid login', fakeAsync(() => {
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123',
    });
    spyOn(component, 'submitLogin');

    component.login();
    tick();

    expect(component.submitLogin).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
  }));

  it('should not call submitLogin on invalid login', fakeAsync(() => {
    component.form.setValue({ email: '', password: '' });
    spyOn(component, 'submitLogin');

    component.login();
    tick();

    expect(component.submitLogin).not.toHaveBeenCalled();
  }));

  it('should set error to true on invalid credentials', fakeAsync(() => {
    const mockUser = { id: undefined };
    authServiceSpy.login.and.returnValue(of(mockUser));

    component.submitLogin('test@example.com', 'wrongpassword');
    tick();

    expect(component.error).toBeTrue();
  }));

  it('should set user id in localStorage on successful login', fakeAsync(() => {
    const mockUser = { id: '123' };
    authServiceSpy.login.and.returnValue(of(mockUser));
    spyOn(localStorage, 'setItem');

    component.submitLogin('test@example.com', 'password123');
    tick();

    expect(localStorage.setItem).toHaveBeenCalledWith('id', '123');
  }));
});
