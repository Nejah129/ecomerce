import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CheckoutSubmit } from '../common/checkout-submit';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private baseUrl = 'http://localhost:8080/api/order';
  constructor(private httpClient: HttpClient) {}
  getCreditCardMonths(): Observable<number[]> {
    let data: number[] = [];
    for (let theMonth = 1; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }
  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }
  submitOrder(order: CheckoutSubmit): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/add`, order, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'json'
    }).pipe(
      catchError(error => {
        console.error('Error during HTTP request', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        return of({ error: 'Request failed' });
      })
    );
  }
  
}
