import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SignupPage } from './signup.page';
import { SignupService } from 'src/app/services/signup.service';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';

describe('SignupPage', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;
  let signupServiceSpy: jasmine.SpyObj<SignupService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const signupServiceSpyObj = jasmine.createSpyObj('SignupService', [
      'createUser',
      'redirectSignupHome',
    ]);
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', [
      'getIsAuth',
    ]);

    await TestBed.configureTestingModule({
      declarations: [SignupPage],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        FormBuilder,
        { provide: SignupService, useValue: signupServiceSpyObj },
        { provide: AuthService, useValue: authServiceSpyObj },
      ],
    }).compileComponents();

    signupServiceSpy = TestBed.inject(
      SignupService
    ) as jasmine.SpyObj<SignupService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    formBuilder = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createUser and redirectSignupHome when signup is successful', fakeAsync(() => {
    spyOn(component.router, 'navigate');
    authServiceSpy.getIsAuth.and.returnValue(false);
    component.form.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    component.signup();
    tick();

    expect(signupServiceSpy.createUser).toHaveBeenCalledWith(
      'Test User',
      'test@example.com',
      'password123'
    );
    expect(signupServiceSpy.redirectSignupHome).toHaveBeenCalled();
    expect(component.error).toBeFalse();
  }));

  it('should set error to true when form is invalid', () => {
    component.form.setValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    component.signup();

    expect(component.error).toBeTrue();
  });

  it('should set error to true when passwords do not match', () => {
    component.form.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'differentPassword',
    });

    component.signup();

    expect(component.error).toBeTrue();
  });
});
