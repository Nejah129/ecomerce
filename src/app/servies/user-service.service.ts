import { User } from './../common/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private baseUrl = 'http://localhost:8080/api/user';
  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('token')
  );
  private userSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('user') || '{}')
  );

  token$ = this.tokenSubject.asObservable();
  user$ = this.userSubject.asObservable();
  constructor(private httpClient: HttpClient, private router: Router) {}

  UserSignUp(newUser: User): Observable<any> {
    return this.httpClient
      .post<any>(`${this.baseUrl}/signup`, newUser, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
      })
      .pipe(
        catchError((error) => {
          console.error('Error during HTTP request', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error,
          });
          return of({ error: 'Request failed' });
        })
      );
  }
  UserLogin(theUser: User): Observable<any> {
    return this.httpClient
      .post<any>(`${this.baseUrl}/login`, theUser, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json',
      })
      .pipe(
        catchError((error) => {
          console.error('Error during HTTP request', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error,
          });
          return of({ error: 'Request failed' });
        })
      );
  }
  setToken(token: string | null): void {
    localStorage.setItem('token', token || '');
    this.tokenSubject.next(token);
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  clearAuthData(): void {
    localStorage.clear();
    this.tokenSubject.next(null);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  getData(): void {
    localStorage.getItem('token');

    localStorage.getItem('user');
    console.log(localStorage.getItem('user'))
  }
}
