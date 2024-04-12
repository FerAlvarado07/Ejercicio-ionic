import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  constructor(public router: Router, private http: HttpClient) {}
  public apiUsers = 'http://localhost:3000/users';
  redirectSignup() {
    this.router.navigate(['/signup']);
    localStorage.clear();
  }

  redirectSignupHome() {
    this.router.navigate(['/home']);
  }

  createUser(name: string, email: string, password: string) {
    const users = this.http.get<any>(this.apiUsers);
    users.subscribe((users) => {
      let maxId = -Infinity;

      for (let i = 0; i < users.length; i++) {
        if (users[i].id > maxId) {
          maxId = users[i].id;
        }
      }
      console.log(users);
      const newId: number = Number(maxId) + 1;

      const newUser: User = {
        id: newId.toString(),
        name: name,
        password: password,
        email: email,
      };
      console.log(newUser);
      this.http.post<User>(`${this.apiUsers}`, newUser).subscribe();
      localStorage.setItem('id', newUser.id);
    });
  }
}
