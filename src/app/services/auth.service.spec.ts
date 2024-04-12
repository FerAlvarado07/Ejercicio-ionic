import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpyObj }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isAuth to true and navigate to home on successful login', () => {
    const mockUsers = [{ email: 'test@example.com', password: 'password123' }];
    const mockResponse = { isAuth: true };

    spyOn(service.http, 'get').and.returnValue(of(mockUsers));
    spyOn(service.router, 'navigate');

    service.login('test@example.com', 'password123').subscribe((isAuth) => {
      expect(isAuth).toBeTrue();
      expect(service.getIsAuth()).toBeTrue();
      expect(service.router.navigate).toHaveBeenCalledWith(['/home']);
    });

    const req = httpMock.expectOne(service.apiUsers);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should not set isAuth and not navigate on failed login', () => {
    const mockUsers = [{ email: 'test@example.com', password: 'password123' }];
    const mockResponse = { isAuth: false };

    spyOn(service.http, 'get').and.returnValue(of(mockUsers));
    spyOn(service.router, 'navigate');

    service.login('test@example.com', 'wrongpassword').subscribe((isAuth) => {
      expect(isAuth).toBeFalse();
      expect(service.getIsAuth()).toBeFalse();
      expect(service.router.navigate).not.toHaveBeenCalled();
    });

    const req = httpMock.expectOne(service.apiUsers);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should set isAuth to false when setIsAuth is called with false', () => {
    service.setIsAuth(true);
    expect(service.getIsAuth()).toBeTrue();

    service.setIsAuth(false);
    expect(service.getIsAuth()).toBeFalse();
  });
});
