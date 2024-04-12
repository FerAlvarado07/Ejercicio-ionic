import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupService } from './signup.service';
import { User } from '../models/user.model';

describe('SignupService', () => {
  let service: SignupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [SignupService],
    });
    service = TestBed.inject(SignupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should redirect to signup and clear localStorage', () => {
    spyOn(service.router, 'navigate');
    spyOn(localStorage, 'clear');

    service.redirectSignup();

    expect(service.router.navigate).toHaveBeenCalledWith(['/signup']);
    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('should redirect to home', () => {
    spyOn(service.router, 'navigate');

    service.redirectSignupHome();

    expect(service.router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should create a new user', () => {
    const newUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'pass',
      },
    ];

    service.createUser(newUser.name, newUser.email, newUser.password);

    const req = httpMock.expectOne(service.apiUsers);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    const req2 = httpMock.expectOne(service.apiUsers);
    expect(req2.request.method).toBe('POST');
    req2.flush({});

    expect(localStorage.getItem('id')).toBe(newUser.id);
  });
});
