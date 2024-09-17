import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Email } from '../common/email';

@Injectable({
  providedIn: 'root',
})
export class EmailSenderService {
  private baseUrl = 'http://localhost:8080/api';
  constructor(private httpClient: HttpClient) {}
  sendEmail(email: Email): Observable<Email> {
    return this.httpClient.post<Email>(`${this.baseUrl}/email/send`, email);
  }
}
