import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LolService {

  private apiUrl = 'http://localhost:4000/api/lol';

  constructor(private http: HttpClient) {}

  getLol(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
