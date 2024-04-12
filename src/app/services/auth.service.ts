import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public router: Router, public http: HttpClient) {}
  public apiUsers = 'http://localhost:3000/users';
  isAuth: boolean = false;
  currentlog = {};

  setIsAuth(isAuth: boolean): void {
    if (isAuth) {
      localStorage.setItem('token', 'token');
    } else {
      localStorage.clear();
    }
  }

  getIsAuth(): boolean {
    let token = localStorage.getItem('token');
    return token != '' && token != null;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.apiUsers).pipe(
      map((users) => {
        this.isAuth =
          users.find(
            (user) => user.email === username && user.password === password
          ) || false;
        if (this.isAuth) {
          localStorage.setItem('token', 'token');
          this.router.navigate(['/home']);
        }
        return this.isAuth;
      })
    );
  }

  getUserId(username: string): Observable<string> {
    return this.http.get<string>(`${this.apiUsers}?username=${username}`);
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.clear();
  }
}
