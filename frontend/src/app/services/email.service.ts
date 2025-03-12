import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EmailRequest {

  to:string;
  subject?:string;
  name:string;

}
export interface EmailResponse {
  message:string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  httpClient = inject(HttpClient)
  
  private backendUrl = 'http://localhost:4000/api';

  requestEmailUpdates(emailRequest: EmailRequest): Observable<EmailResponse> {
    return this.httpClient.post<EmailResponse>(`${this.backendUrl}/sendemail`,emailRequest)
  }
}
