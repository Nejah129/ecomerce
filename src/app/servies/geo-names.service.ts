import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoNamesService {
  private baseUrl = 'http://api.geonames.org';
  private username = 'nejahyen'; 

  constructor(private http: HttpClient) { }

  // Get all countries
  getCountries(): Observable<any> {
    console.log(this.http.get(`${this.baseUrl}/countryInfoJSON?username=${this.username}`));
    return this.http.get(`${this.baseUrl}/countryInfoJSON?username=${this.username}`);
  }

  // Get states/provinces by country code
  getStates(countryCode: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/childrenJSON?geonameId=${countryCode}&username=${this.username}`);
  }
}
